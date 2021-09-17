import { BusinessError } from "../../../common/BusinessError";
import { PrimitiveValueObject } from "../PrimitiveValueObject";

export class SeatRow extends PrimitiveValueObject<string> {
  static create(value: string): SeatRow {
    if (!Number.isNaN(Number(value))) throw BusinessError.INVALID_ROW
    return new SeatRow(value);
  }
}