import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import mongoose from 'mongoose';
import { FeesCollectedEventModel } from '../models';

const dbConnector: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  try {
    await mongoose.connect('mongodb://localhost:27017/lifi');
    fastify.decorate('mongo', { FeesCollectedEvent: FeesCollectedEventModel });
  } catch (err) {
    console.error(err);
  }
};

export default dbConnector;

