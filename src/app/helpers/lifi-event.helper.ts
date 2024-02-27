import { BigNumber, ethers } from 'ethers'
import { FeeCollector__factory } from 'lifi-contract-typings'
import { BlockTag } from '@ethersproject/abstract-provider'

const CONTRACT_ADDRESS = '0xbD6C7B0d2f68c2b7805d88388319cfB6EcB50eA9'
const POLYGON_RPC = 'https://polygon-rpc.com'

export interface ParsedFeeCollectedEvents {
  token: string; // the address of the token that was collected
  integrator: string; // the integrator that triggered the fee collection
  integratorFee: BigNumber; // the share collector for the integrator
  lifiFee: BigNumber; // the share collected for lifi
}

/**
 * For a given block range all `FeesCollected` events are loaded from the Polygon FeeCollector
 * @param fromBlock
 * @param toBlock
 */
export const loadFeeCollectorEvents = (fromBlock: BlockTag, toBlock: BlockTag): Promise<ethers.Event[]> => {
  const feeCollector = new ethers.Contract(
    CONTRACT_ADDRESS,
    FeeCollector__factory.createInterface(),
    new ethers.providers.JsonRpcProvider(POLYGON_RPC)
  )
  const filter = feeCollector.filters.FeesCollected()
  return feeCollector.queryFilter(filter, fromBlock, toBlock)
}

/**
 * Takes a list of raw events and parses them into ParsedFeeCollectedEvents
 * @param events
 */
export const parseFeeCollectorEvents = (
  events: ethers.Event[],
): ParsedFeeCollectedEvents[] => {
  const feeCollectorContract = new ethers.Contract(
    CONTRACT_ADDRESS,
    FeeCollector__factory.createInterface(),
    new ethers.providers.JsonRpcProvider(POLYGON_RPC)
  )

  return events.map(event => {
    const parsedEvent = feeCollectorContract.interface.parseLog(event)

    const feesCollected: ParsedFeeCollectedEvents = {
      token: parsedEvent.args[0],
      integrator: parsedEvent.args[1],
      integratorFee: BigNumber.from(parsedEvent.args[2]),
      lifiFee: BigNumber.from(parsedEvent.args[3]),
    }
    return feesCollected
  })
}
