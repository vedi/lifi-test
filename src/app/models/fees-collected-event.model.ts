import {getModelForClass, prop} from "@typegoose/typegoose";
import {FeesCollectedEvent} from "../interfaces";

class FeesCollectedEventSchema implements FeesCollectedEvent {
  @prop({required: true, type: String})
  token: string;
  @prop({required: true, type: String})
  integrator: string;
  @prop({required: true, type: String})
  integratorFee: string;
  @prop({required: true, type: String})
  lifiFee: string;
}
export const FeesCollectedEventModel = getModelForClass(FeesCollectedEventSchema);
