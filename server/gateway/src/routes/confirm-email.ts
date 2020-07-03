import { Request, Response } from 'express';
import { redis } from '../redis';
import { User } from '../entity/User';

export const confirmEmail = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = await redis.get(id);
  if (userId) {
    await User.update({ id: userId }, { confirmed: true });
    await redis.del(id);
    res.send('Email confirmed.');
    // TODO :: Send back response with confirmation email
  } else {
    // TODO :: Create and return error
    res.send('Error confirming email.');
  }
};
