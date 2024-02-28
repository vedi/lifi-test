import Fastify, { FastifyInstance } from 'fastify';
import { app } from './app';

/**
 * TODO: I just kept one integration test as creating good testing infra takes significant time. Bad things here:
 * * it does not use a separate db (and env in general)
 * * it's like a monkey testing: I run, and check the structure of collected events fits (I'd say just proving it somehow works)
 * * it runs on the real chain
 * * it does not clean up DB
 * In the perfect world I'd run hardhat chain, and test this more accurately.
 */

// TODO: Oh, it does not stop tests, I guess I need to change a way how to shut down fastify
describe('app', () => {
  let server: FastifyInstance;

  beforeAll(() => {
    server = Fastify();
    server.register(app);
  });
  afterAll(() => server.server.close());

  describe('GET /', () => {
    it('should respond with a message', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/',
      });

      expect(response.json()).toEqual({ message: 'Hello API' });
    });
  });

  describe('GET /fees-collected-events', () => {
    // TODO: Never do like this in your tests :)
    beforeAll(() => new Promise((resolve) => setTimeout(resolve, 10_000)));
    it('should respond with events', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/fees-collected-events',
      });

      const result = response.json();

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            transactionHash: expect.any(String),
            logIndex: expect.any(Number),
            token: expect.any(String),
            integrator: expect.any(String),
            integratorFee: expect.any(String),
            lifiFee: expect.any(String),
          }),
        ]),
      );

      expect((result as unknown[]).length).toBeGreaterThan(0);
    });
  });
});
