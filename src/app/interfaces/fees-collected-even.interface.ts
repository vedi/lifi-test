export interface FeesCollectedEvent {
  transactionHash: string;
  logIndex: number;
  token: string;
  integrator: string;
  integratorFee: string;
  lifiFee: string;
}
