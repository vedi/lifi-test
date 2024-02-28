import {getModelForClass, index, prop, ReturnModelType,} from "@typegoose/typegoose";
import {FeesCollectedEvent} from "../interfaces";


@index({transactionHash: 1, logIndex: 1}, {unique: true})
class FeesCollectedEventSchema implements FeesCollectedEvent {
  @prop({required: true, type: String})
  transactionHash: string;
  @prop({required: true, type: Number})
  logIndex: number;
  @prop({required: true, type: String})
  token: string;
  @prop({required: true, type: String})
  integrator: string;
  @prop({required: true, type: String})
  integratorFee: string;
  @prop({required: true, type: String})
  lifiFee: string;

  public static upsert(this: ReturnModelType<typeof FeesCollectedEventSchema>, feesCollectedEvent: FeesCollectedEvent): Promise<unknown> {
    const { transactionHash, logIndex, ...rest} = feesCollectedEvent;
    return this.updateOne(
      { transactionHash, logIndex },
      { ...rest },
      { upsert: true},
    );
  }
}
export const FeesCollectedEventModel = getModelForClass(FeesCollectedEventSchema);
