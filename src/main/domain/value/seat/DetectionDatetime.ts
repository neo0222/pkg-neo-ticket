
import moment from "moment";
import { BusinessError } from "../../../common/BusinessError";
import { PrimitiveValueObject } from "../PrimitiveValueObject";

export class DetectionDatetime extends PrimitiveValueObject<moment.Moment> {
  static create(value: string): DetectionDatetime {
    const result: string = moment(value, 'YYYY-MM-DD HH:mm:ss').locale('ja').format('YYYY-MM-DD HH:mm:ss')
    if (result !== value) throw BusinessError.INVALID_DATE_FORMAT
    return new DetectionDatetime(moment(value, 'YYYY-MM-DD HH:mm:ss').locale('ja'));
  }

  static fromUnixTime(unixTime: number): DetectionDatetime {
    return new DetectionDatetime(moment.unix(unixTime).locale('ja'))
  }

  format(): string {
    return this._value.format('YYYY-MM-DD HH:mm:ss')
  }

  toString(): string {
    return this.format()
  }

  ISO8601(): string {
    return this.value.toISOString()
  }
}