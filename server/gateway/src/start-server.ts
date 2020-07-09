import express, { Request, Response } from 'express';
import { ApolloServer } from 'apollo-server-express';
import session from 'express-session';
import RedisStore from 'connect-redis';
import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { createTypeORMConnection } from './utils/db-connection';
import { redis } from './redis';
import { corsOptionsDelegate } from './utils/cors';
import { limiter } from './utils/rate-limiter';
import { schemas } from './utils/merge-schema';
import { warning } from './utils/warnings';
import {
  DEFAULT_HOST,
  DEFAULT_PORT,
  REDIS_SESSION_PREFIX,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
} from './constants';
import { confirmEmail } from './routes/confirm-email';
import { User } from './entity/User';

// TODO :: Move these initializations to a separate file with an export
const hostExternal = process.env.GATEWAY_DEV_HOST_EXT || DEFAULT_HOST;
if (!process.env.GATEWAY_DEV_HOST_EXT) {
  warning('HOST', { host: DEFAULT_HOST });
}

const port = process.env.GATEWAY_DEV_PORT || DEFAULT_PORT;
if (!process.env.GATEWAY_DEV_PORT) {
  warning('PORT', { port: DEFAULT_PORT });
}

const SESSION_SECRET = process.env.SESSION_SECRET || undefined;
if (!process.env.SESSION_SECRET) {
  console.log('NO SESSION_SECRET ENVIRONMENT VARIABLE AVAILABLE');
}

export const startServer = async (): Promise<void> => {
  const connection = await createTypeORMConnection();

  const app = express();
  const server = new ApolloServer({
    schema: schemas,
    context: ({ req }) => ({ redis, session: req.session, request: req }),
  });

  const RedisStoreWithSession = RedisStore(session);
  app.use(
    session({
      store: new RedisStoreWithSession({
        client: redis,
        prefix: REDIS_SESSION_PREFIX,
      }),
      name: 'qid',
      secret: SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    })
  );

  if (process.env.NODE_ENV === 'production') {
    app.use(limiter(redis));
  }

  // PASSPORT

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new TwitterStrategy(
      {
        consumerKey: TWITTER_CONSUMER_KEY(),
        consumerSecret: TWITTER_CONSUMER_SECRET(),
        callbackURL: 'http://localhost:4000/auth/twitter/callback',
        includeEmail: true,
      },
      async (_token, _tokenSecret, profile, cb) => {
        console.log('TWITTER PROFILE:', profile);
        const { id, emails } = profile;

        const query = await connection
          .getRepository(User)
          .createQueryBuilder('user')
          .where('user.twitterId = :id', { id });

        let emailFromTwitter = null;

        if (emails) {
          emailFromTwitter = emails[0].value;
          await query.orWhere('user.email = :emailFromTwitter', { emailFromTwitter });
        }

        let user = await query.getOne();

        if (!user) {
          user = await User.create({
            twitterId: id,
            email: emailFromTwitter,
          }).save();
        } else if (!user.twitterId && user.email) {
          user.twitterId = id;
          await user.save();
        } else if (user.twitterId) {
          // @todo handle this login
        }

        return cb(null, { id: user.id });
      }
    )
  );

  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get(
    '/auth/twitter/callback',
    passport.authenticate('twitter', { session: false }),
    (req: Request, res: Response) => {
      if (req.session && req.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        req.session.userId = (req.user as any).id;
      }
      // @todo redirect to frontend
      res.sendStatus(200);
    }
  );

  // END PASSPORT

  server.applyMiddleware({ app, cors: corsOptionsDelegate });

  app.get('/', (_req: Request, res: Response) => {
    res.sendStatus(204);
  });

  app.get('/confirm/:id', confirmEmail);

  app.listen({ hostExternal, port }, () => {
    console.log(`
      The Server is running!

      Host: http://${hostExternal}:${port}${server.graphqlPath}
      Host(localhost): http://localhost:4000
      Docker: http://gateway-dev:4000
    `);
  });
};
