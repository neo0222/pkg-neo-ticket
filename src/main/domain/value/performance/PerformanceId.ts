import { PrimitiveValueObject } from "../PrimitiveValueObject";

export class PerformanceId extends PrimitiveValueObject<string> {
  static create(value: string): PerformanceId {
    return new PerformanceId(value);
  }
}