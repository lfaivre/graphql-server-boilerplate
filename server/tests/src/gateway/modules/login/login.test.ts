import { request } from 'graphql-request';
import fetch from 'node-fetch';
import randomize from 'randomatic';
import { host } from '../../../setup';
import { register, login, TEST_verifyCreateConfirmationLink } from './mutations';
import { ERRORS } from '../../../../shared/src/gateway/constants/module-login-errors';

const email = `${randomize('Aa0', 4)}@test.com`;
const password = randomize('*', 4);

describe('log in user', () => {
  test('user can successfully login', async () => {
    const mutation1 = register(email, password);
    const response1 = await request(host, mutation1);
    expect(response1).toEqual({ register: null });

    const mutation2 = TEST_verifyCreateConfirmationLink(email);
    const response2 = await request(host, mutation2);
    expect(response2).not.toEqual({ TEST_verifyCreateConfirmationLink: null });
    const link = response2.TEST_verifyCreateConfirmationLink;
    expect(link).not.toEqual(undefined);
    const response = await fetch(link);
    const text = await response.text();
    expect(text).toEqual('Email confirmed.');

    const mutation3 = login(email, password);
    const response3 = await request(host, mutation3);
    expect(response3).toEqual({ login: null });
  });

  test('user is unable to login with incorrect email', async () => {
    const email1 = `${randomize('Aa0', 1)}${email}`;
    const mutation = login(email1, password);
    const response = await request(host, mutation);
    expect(response).toEqual({ login: [ERRORS.LOGIN_INVALID] });
  });

  test('user is unable to login with incorrect password', async () => {
    const password1 = randomize('*', 4);
    const mutation = login(email, password1);
    const response = await request(host, mutation);
    expect(response).toEqual({ login: [ERRORS.LOGIN_INVALID] });
  });

  test('user is unable to login with an unconfirmed email', async () => {
    const email1 = `${randomize('Aa0', 4)}@test.com`;
    const password1 = randomize('*', 4);

    const mutation1 = register(email1, password1);
    const response1 = await request(host, mutation1);
    expect(response1).toEqual({ register: null });

    const mutation2 = login(email1, password1);
    const response2 = await request(host, mutation2);
    expect(response2).toEqual({ login: [ERRORS.EMAIL_NOT_CONFIRMED] });
  });
});
