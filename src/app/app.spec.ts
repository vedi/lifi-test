import Fastify, { FastifyInstance } from 'fastify';
import { app } from './app';

describe('app', () => {
  let server: FastifyInstance;

  beforeAll(() => {
    server = Fastify();
    server.register(app);
  });

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
    it('should respond with a message', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/fees-collected-events',
      });

      expect(response.json()).toEqual([]);
    });
  });
});
