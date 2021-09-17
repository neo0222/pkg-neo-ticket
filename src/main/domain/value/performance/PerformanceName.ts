import { PrimitiveValueObject } from "../PrimitiveValueObject";

export class PerformanceName extends PrimitiveValueObject<string> {
  static create(value: string): PerformanceName {
    return new PerformanceName(value);
  }
}