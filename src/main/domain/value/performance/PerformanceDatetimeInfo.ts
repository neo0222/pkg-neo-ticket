import { ValueObject } from "../ValueObject";
import { PerformanceDate } from "./PerformanceDate";
import { PerformanceStartTime } from "./PerformanceStartTime";
import { MatineeOrSoiree } from "./MatineeOrSoiree";

interface PerformanceDatetimeInfoProps {
  day: PerformanceDate
  startTime: PerformanceStartTime
  matineeOrSoiree: MatineeOrSoiree
}

interface PerformanceDatetimeInfoArgs {
  day: string
  startTime: string
  matineeOrSoiree: MatineeOrSoiree
}

export class PerformanceDatetimeInfo extends ValueObject<PerformanceDatetimeInfoProps> {
  static create(args: PerformanceDatetimeInfoArgs): PerformanceDatetimeInfo {
    return new PerformanceDatetimeInfo({
      day: PerformanceDate.create(args.day),
      startTime: PerformanceStartTime.create(args.startTime),
      matineeOrSoiree: args.matineeOrSoiree,
    });
  }

  get day() {
    return this._value.day
  }

  get startTime() {
    return this._value.startTime
  }

  get matineeOrSoiree() {
    return this._value.matineeOrSoiree
  }

}