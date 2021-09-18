import { BusinessError } from "../../../common/BusinessError";
import { PrimitiveValueObject } from "../PrimitiveValueObject";

export class SeatRow extends PrimitiveValueObject<string> {
  static create(value: string): SeatRow {
    return new SeatRow(value);
  }

  toString(): string {
    return this.value
  }

  isEqualOrLessThan(num: number): boolean {
    return Number(this.value) <= num
  }
}