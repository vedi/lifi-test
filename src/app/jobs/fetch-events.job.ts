import {AsyncTask, SimpleIntervalJob} from "toad-scheduler";
import {FastifyInstance} from "fastify";
import {Name} from "../types";
import {configs} from "../configs";
import {loadFeeCollectorEvents} from "../helpers";
import {getBlockNumber, parseFeeCollectorEvents} from "../helpers";

// TODO: Job is not the best place to put this logic. I'm ignoring good architecture layers here.
const fetchEvents = async function ({log, mongo}: FastifyInstance) {
  log.info('Starting fetchEvents');
  const lastFetchedBlock = await mongo.Value.findOneAndUpdateByName(
    Name.lastBlock,
    configs.oldestBlock,
  );
  const lastFetchedBlockNumber = Number.parseInt(lastFetchedBlock.value, 10);
  if (Number.isNaN(lastFetchedBlockNumber)) {
    // TODO: I'd prefer to have some meaningful error hierarchy
    throw new Error(`lastBlock value is wrong: ${lastFetchedBlock.value}`);
  }
  const fromBlockNumber = lastFetchedBlockNumber  + 1;
  // TODO: In reality I'd also consider needed confirmations of the blocks.
  const toBlockNumber = Math.min(await getBlockNumber(), fromBlockNumber + configs.blockLimit);
  log.info(`Fetching from block: ${fromBlockNumber} to block: ${toBlockNumber}`);
  const events = parseFeeCollectorEvents(
    await loadFeeCollectorEvents(fromBlockNumber, toBlockNumber),
  );
  // TODO: If we do not have a requirement to store them strictly in historical order, I use Promise.all. In real world usually it's "must have". In this case we'd need to order the collection, and iterate in the sync way one by one
  await Promise.all(events
    .map((event) =>
      mongo.FeesCollectedEvent.upsert({
        ...event,
        integratorFee: event.integratorFee.toString(),
        lifiFee: event.lifiFee.toString(),
      }))
  );

  await mongo.Value.updateOneByName(Name.lastBlock, toBlockNumber.toString());

  log.info(`${events.length} event(s) fetched`);
}

export const fetchEventsJobFn = (fastify: FastifyInstance) =>
  new SimpleIntervalJob({seconds: 1}, new AsyncTask(
    'fetchEventsJob',
    () => fetchEvents(fastify),
    (err) => {
      fastify.log.error('fetchEventsJob failed with');
      fastify.log.error(err);
    }
  ));
