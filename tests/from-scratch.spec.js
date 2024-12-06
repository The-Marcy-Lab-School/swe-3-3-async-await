import { describe, it, expect, afterEach, afterAll, beforeEach, vi } from 'vitest';

import { fetchHandler } from '../src/from-scratch.js';
import ScoreCounter from 'score-tests';
import path from 'path';
import nock from 'nock';
import nodeFetch from 'node-fetch';

// node fetch works nicely with nock, native fetch does not and may be missing on some systems
global.fetch = nodeFetch;

const testSuiteName = 'From Scratch Tests';
const scoresDir = path.join(__dirname, '..', 'scores');
const scoreCounter = new ScoreCounter(testSuiteName, scoresDir);

const baseUrl = 'https://jsonplaceholder.typicode.com';
const usersUrl = `${baseUrl}/users`;

describe(testSuiteName, () => {
  afterEach(() => {
    vi.restoreAllMocks()
  });

  it('Returns a promise', async () => {
    const promise = fetchHandler(usersUrl);
    expect(promise).toBeInstanceOf(Promise);

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('Resolves a tuple with 2 elements', async () => {
    const tuple = await fetchHandler(usersUrl);
    expect(tuple).toBeInstanceOf(Array);
    expect(tuple.length).toBe(2);

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('Makes a fetch call to the passed in url', async () => {
    const url = '/users';
    const fakeRoute = nock(baseUrl).get(url).reply(200);
    try {
      await fetchHandler(`${baseUrl}${url}`)
      expect(fakeRoute.isDone()).toBe(true);
    } catch (error) {
      console.log('YOUR TESTING ERROR:', error.message);
      expect(error).toBeUndefined();
    }

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('Makes a fetch call to the passed in url and options', async () => {
    const route = '/users';
    const fakeRoute = nock(baseUrl).post(route).reply(200, {});

    try {
      await fetchHandler(`${baseUrl}${route}`, { method: 'POST' })
      expect(fakeRoute.isDone()).toBe(true);
    } catch (error) {
      console.log('YOUR TESTING ERROR:', error.message);
      expect(error).toBeUndefined();
    }

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('Catches a network error', async () => {
    const url = '/users';
    const fakeRoute = nock(baseUrl).get(url).replyWithError('Network Error');

    try {
      await fetchHandler(`${baseUrl}${url}`)
      expect(fakeRoute.isDone()).toBe(true);
    } catch (error) {
      console.log('YOUR TESTING ERROR:', error.message);
      expect(error).toBeUndefined();
    }

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('Resolves the error as the second value in the tuple', async () => {
    const url = '/users';
    const fakeRoute = nock(baseUrl).get(url).replyWithError('Network Error');

    try {
      const [data, error] = await fetchHandler(`${baseUrl}${url}`)
      expect(fakeRoute.isDone()).toBe(true);

      expect(data).toBeNull();
      expect(error).toBeInstanceOf(Error);
    } catch (error) {
      console.log('YOUR TESTING ERROR:', error.message);
      expect(error).toBeUndefined();
    }

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('Console.warns the expected error', async () => {
    const url = '/users';
    const fakeRoute = nock(baseUrl).get(url).replyWithError('Network Error');

    const spy = vi.spyOn(console, 'warn');

    try {
      await fetchHandler(`${baseUrl}${url}`)
      expect(fakeRoute.isDone()).toBe(true);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(expect.any(Error));
    } catch (error) {
      console.log('YOUR TESTING ERROR:', error.message);
      expect(error).toBeUndefined();
    }

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('Throws an error if the response is not ok', async () => {
    const route = '/users';
    const fakeRoute = nock(baseUrl).get(route).reply(500);

    try {
      const [data, error] = await fetchHandler(`${baseUrl}${route}`)

      console.log('data, error:', data, error);
      expect(fakeRoute.isDone()).toBe(true);

      expect(data).toBeNull();
      expect(error).toBeInstanceOf(Error);
    } catch (error) {
      console.log('YOUR TESTING ERROR:', error.message);
      expect(error).toBeUndefined();
    }

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('Handles a 204 response (by calling .text())', async () => {
    const route = '/users';
    const fakeRoute = nock(baseUrl).get(route).reply(204);

    try {
      const [data, error] = await fetchHandler(`${baseUrl}${route}`)

      expect(fakeRoute.isDone()).toBe(true);

      expect(data).toBe('');
      expect(error).toBeNull();
    } catch (error) {
      console.log('YOUR TESTING ERROR:', error.message);
      expect(error).toBeUndefined();
    }

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('Handles a text response', async () => {
    const route = '/users';
    const textResponse = '<h1>Hi!</h1>'
    const fakeRoute = nock(baseUrl).get(route).reply(200, textResponse);

    try {
      const [data, error] = await fetchHandler(`${baseUrl}${route}`)

      expect(fakeRoute.isDone()).toBe(true);

      expect(data).toBe(textResponse);
      expect(error).toBeNull();
    } catch (error) {
      console.log('YOUR TESTING ERROR:', error.message);
      expect(error).toBeUndefined();
    }

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('Handles a JSON response', async () => {
    const route = '/users';
    const jsonResponse = { id: 1, username: 'Leanne_Graham' };
    const fakeRoute = nock(baseUrl).get(route).reply(200, jsonResponse);

    try {
      const [data, error] = await fetchHandler(`${baseUrl}${route}`)

      expect(fakeRoute.isDone()).toBe(true);

      expect(data).toEqual(jsonResponse);
      expect(error).toBeNull();
    } catch (error) {
      console.log('YOUR TESTING ERROR:', error.message);
      expect(error).toBeUndefined();
    }

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  beforeEach(() => scoreCounter.add(expect));
  afterAll(scoreCounter.export);
})
