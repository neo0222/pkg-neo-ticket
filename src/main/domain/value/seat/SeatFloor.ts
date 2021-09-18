import { BusinessError } from "../../../common/BusinessError";
import { PrimitiveValueObject } from "../PrimitiveValueObject";

export class SeatFloor extends PrimitiveValueObject<string> {
  static create(value: string): SeatFloor {
    if (!['1', '2'].includes(value)) throw BusinessError.INVALID_FLOOR
    return new SeatFloor(value);
  }

  toString(): string {
    return this.value
  }

  isEqualOrLessThan(num: number): boolean {
    return Number(this.value) <= num
  }
}