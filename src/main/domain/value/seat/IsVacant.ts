import { BusinessError } from "../../../common/BusinessError";
import { PrimitiveValueObject } from "../PrimitiveValueObject";

export class IsVacant extends PrimitiveValueObject<boolean> {
  static create(value: boolean): IsVacant {
    return new IsVacant(value);
  }

  toString(): string {
    return this.value ? 'true' : 'false'
  }
}