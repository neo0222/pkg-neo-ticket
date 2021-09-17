import { PrimitiveValueObject } from "../PrimitiveValueObject";

export class PerformanceCode extends PrimitiveValueObject<string> {
  static create(value: string): PerformanceCode {
    return new PerformanceCode(value);
  }
}