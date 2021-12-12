import moment from "moment";
import { BusinessError } from "../../../common/BusinessError";
import { PrimitiveValueObject } from "../PrimitiveValueObject";

export class PerformanceDate extends PrimitiveValueObject<moment.Moment> {
  static create(value: string): PerformanceDate {
    const result: string = moment(value, 'YYYYMMDD').locale('ja').format('YYYYMMDD')
    if (result !== value) throw BusinessError.INVALID_DATE_FORMAT
    return new PerformanceDate(moment(value, 'YYYYMMDD').locale('ja'));
  }

  format(): string {
    return this._value.format('YYYYMMDD')
  }

  toString(): string {
    return this.format()
  }

  formatJp(): string {
    return this._value.format('YYYY年M月D日(ddd)')
  }

  equals(target: PerformanceDate): boolean {
    return this._value.isSame(target._value)
  }

  isSameOrAfter(target: PerformanceDate): boolean {
    return this._value.isSameOrAfter(target.value)
  }
}