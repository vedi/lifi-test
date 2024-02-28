import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {fastifySchedule} from "@fastify/schedule";
import {fetchEventsJobFn} from "../jobs";
import fp from "fastify-plugin";

const scheduler: FastifyPluginAsync = fp(async function (fastify: FastifyInstance) {
  try {
    fastify.register(fastifySchedule);
    // TODO: Completely dislike that old-style promise. There should be a way to organize this in a better way.
    fastify.ready().then(() => {
      // TODO: How should DI be organized in fastify? I'm following this crazy way on my own :)
      // TODO: I prefer to fetch block periodical in the code instead of subscribing to new block event as underhood it does the same, but we have more control in this case
      // TODO: I do not know this scheduler in details, but pretty sure it does not guarantee the single run when we have few instances of the server. To achieve that I'd use redlock, bullmq, or something like that.
      fastify.scheduler.addSimpleIntervalJob(fetchEventsJobFn(fastify));
    });
  } catch (err) {
    console.error(err);
  }
})
export default scheduler;
