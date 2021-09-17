import { BusinessError } from "../../../common/BusinessError";
import { PrimitiveValueObject } from "../PrimitiveValueObject";

export class SeatColumn extends PrimitiveValueObject<string> {
  static create(value: string): SeatColumn {
    if (!Number.isNaN(Number(value))) throw BusinessError.INVALID_COLUMN
    return new SeatColumn(value);
  }
}