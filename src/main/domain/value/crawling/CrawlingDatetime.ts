
import moment from "moment";
import { BusinessError } from "../../../common/BusinessError";
import { PrimitiveValueObject } from "../PrimitiveValueObject";
import { DetectionDatetime } from "../seat/DetectionDatetime";

export class CrawlingDatetime extends PrimitiveValueObject<moment.Moment> {
  static create(value: string): CrawlingDatetime {
    const result: string = moment(value, 'YYYY-MM-DD HH:mm:ss').locale('ja').format('YYYY-MM-DD HH:mm:ss')
    if (result !== value) throw BusinessError.INVALID_DATE_FORMAT
    return new CrawlingDatetime(moment(value, 'YYYY-MM-DD HH:mm:ss').locale('ja'));
  }

  static fromYYYYMMDDHHmmss(value: string): CrawlingDatetime {
    const result: string = moment(value, 'YYYYMMDDHHmmss').locale('ja').format('YYYYMMDDHHmmss')
    if (result !== value) throw BusinessError.INVALID_DATE_FORMAT
    return CrawlingDatetime.create(moment(value, 'YYYYMMDDHHmmss').locale('ja').format('YYYY-MM-DD HH:mm:ss'))
  }

  format(): string {
    return this._value.format('YYYY-MM-DD HH:mm:ss')
  }

  toString(): string {
    return this.format()
  }

  convertToDetectionDatetime(): DetectionDatetime {
    return DetectionDatetime.create(this.format())
  }
}