import { PerformanceCode } from "../performance/PerformanceCode";
import { ValueObject } from "../ValueObject";

interface SessionGoalProps {
  performanceCode: PerformanceCode
  koenki: string
  yyyymm?: string
}

interface SessionGoalArgs {
  performanceCode: string
  koenki: string
  yyyymm?: string
}

export class SessionGoal extends ValueObject<SessionGoalProps> {
  static create(args: SessionGoalArgs): SessionGoal {
    return new SessionGoal({
      performanceCode: PerformanceCode.create(args.performanceCode),
      koenki: args.koenki,
      yyyymm: args.yyyymm,
    });
  }

  get performanceCode() {
    return this._value.performanceCode
  }

  get koenki() {
    return this._value.koenki
  }

  get yyyymm() {
    return this._value.yyyymm
  }

  equals(other: SessionGoal): boolean {
    return this.performanceCode.equals(other.performanceCode) && this.koenki === other.koenki && this.yyyymm === other.yyyymm
  }

}