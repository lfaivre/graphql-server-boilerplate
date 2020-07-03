import { request } from 'graphql-request';
import fetch from 'node-fetch';
import randomize from 'randomatic';
import { host } from '../../../setup';
import {
  register,
  TEST_verifyCreateConfirmationLink,
  TEST_verifyUserConfirmed,
  TEST_verifyUserIDRemovedFromRedis,
} from './mutations';

const email = `${randomize('Aa0', 4)}@test.com`;
const password = randomize('*', 4);
let link: string;

beforeAll(async () => {
  const mutation = register(email, password);
  const response = await request(host, mutation);
  expect(response).toEqual({ register: null });
});

describe('confirmation link', () => {
  test('user receives a confirmation link after registering', async () => {
    const mutation = TEST_verifyCreateConfirmationLink(email);
    const response = await request(host, mutation);
    expect(response).not.toEqual({ register: null });
    link = response.TEST_verifyCreateConfirmationLink;
  });

  test('confirmation link works', async () => {
    expect(link).not.toEqual(undefined);
    const response = await fetch(link);
    const text = await response.text();
    expect(text).toEqual('Email confirmed.');
  });

  test('user is confirmed', async () => {
    const mutation = TEST_verifyUserConfirmed(email);
    const response = await request(host, mutation);
    expect(response).toEqual({ TEST_verifyUserConfirmed: true });
  });

  test('user id is removed from redis', async () => {
    expect(link).not.toEqual(undefined);
    const chunks = link.split('/');
    const id = chunks[chunks.length - 1];
    const mutation = TEST_verifyUserIDRemovedFromRedis(id);
    const response = await request(host, mutation);
    expect(response).toEqual({ TEST_verifyUserIDRemovedFromRedis: true });
  });
});
