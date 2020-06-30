import { request } from 'graphql-request';
import { host } from '../../../setup/constants';

test('user can be registered', async () => {
  const email = 'test@test.com';
  const password = 'test';
  const mutation = `
  mutation {
    register(email: "${email}", password: "${password}") {
      path
      message
    }
  }
`;
  const response = await request(host, mutation);
  expect(response).toEqual({ register: null });
});

test('user has successfully registered', async () => {
  const email = 'test2@test.com';
  const password = 'test2';
  const mutation1 = `
  mutation {
    register(email: "${email}", password: "${password}") {
      path
      message
    }
  }
`;
  const mutation2 = `
  mutation {
    TEST_verifySuccessfulRegistration(email: "${email}", password: "${password}") {
      path
      message
    }
  }
`;
  await request(host, mutation1);
  const response2 = await request(host, mutation2);
  expect(response2).toEqual({ TEST_verifySuccessfulRegistration: null });
});

test('registering another user with the same email returns an error', async () => {
  const email = 'test3@test.com';
  const password = 'test3';
  const mutation = `
  mutation {
    register(email: "${email}", password: "${password}") {
      path
      message
    }
  }
`;

  const response = await request(host, mutation);
  expect(response).toEqual({ register: null });

  const response2 = await request(host, mutation);
  expect(response2).toEqual({
    register: [
      {
        path: 'email',
        message: 'The email you are using to register has already been taken.',
      },
    ],
  });
});
