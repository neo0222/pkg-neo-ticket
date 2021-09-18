import { BusinessError } from "../../../common/BusinessError";
import { PrimitiveValueObject } from "../PrimitiveValueObject";

export class SeatColumn extends PrimitiveValueObject<string> {
  static create(value: string): SeatColumn {
    return new SeatColumn(value);
  }

  toString(): string {
    return this.value
  }

  isEqualOrLessThan(num: number): boolean {
    return Number(this.value) <= num
  }

  isEqualOrGreaterThan(num: number): boolean {
    return Number(this.value) >= num
  }
}