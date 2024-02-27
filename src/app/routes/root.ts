import { FastifyInstance } from 'fastify';
import FastifyMongooseRest from 'fastify-mongoose-rest';
import {FeesCollectedEventModel} from "../models";

export default async function (fastify: FastifyInstance) {

  const feesCollectedEventFastify = FastifyMongooseRest('/fees-collected-events', FeesCollectedEventModel);

  fastify.route(feesCollectedEventFastify.list);

  fastify.route(feesCollectedEventFastify.details);

  fastify.get('/', async function () {
    return { message: 'Hello API' };
  });
}
