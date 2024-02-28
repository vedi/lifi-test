import {getModelForClass, prop, ReturnModelType} from "@typegoose/typegoose";
import {Value} from "../interfaces";
import {Name} from "../types";


class ValueSchema implements Value {
  @prop({required: true, type: String, unique: true})
  name: string;
  @prop({required: true, type: String})
  value: string;

  public static async findOneAndUpdateByName(this: ReturnModelType<typeof ValueSchema>, name: Name, defaultValue: string) {
    return this.findOneAndUpdate(
      {name},
      {$setOnInsert: {value: defaultValue}},
      {new: true, upsert: true},
    );
  }

  public static async updateOneByName(this: ReturnModelType<typeof ValueSchema>, name: Name, newValue: string) {
    return this.updateOne(
      {name},
      {value: newValue},
      {upsert: true},
    );
  }
}

export const ValueModel = getModelForClass(ValueSchema);
