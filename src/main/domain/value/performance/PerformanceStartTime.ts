import moment from "moment";
import { BusinessError } from "../../../common/BusinessError";
import { PrimitiveValueObject } from "../PrimitiveValueObject";

export class PerformanceStartTime extends PrimitiveValueObject<moment.Moment> {
  static create(value: string): PerformanceStartTime {
    const result: string = moment(value, 'HH:mm').locale('ja').format('HH:mm')
    if (result !== value) throw BusinessError.INVALID_DATE_FORMAT
    return new PerformanceStartTime(moment(value, 'HH:mm').locale('ja'));
  }

  format(): string {
    return this._value.format('HH:mm')
  }

  toString(): string {
    return this.format()
  }
}