import {FastifyInstance, FastifyPluginAsync} from 'fastify';
import mongoose from 'mongoose';
import {FeesCollectedEventModel, ValueModel} from '../models';
import fp from "fastify-plugin";
import {configs} from "../configs";

declare module 'fastify' {
  interface FastifyInstance {
    mongo: { FeesCollectedEvent: typeof FeesCollectedEventModel, Value: typeof ValueModel }
  }
}

const dbConnector: FastifyPluginAsync = fp(async function (fastify: FastifyInstance) {
  try {
    await mongoose.connect(configs.mongodbUri);
    // TODO: I'm pretty sure we can do this better through "glob" or something like that
    fastify.decorate('mongo', { FeesCollectedEvent: FeesCollectedEventModel, Value: ValueModel });
  } catch (err) {
    // TODO: Should use logger instead
    console.error(err);
  }
})

export default dbConnector;

