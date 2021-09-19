import { ValueObject } from "../ValueObject";
import { PerformanceDatetimeInfo } from "./PerformanceDatetimeInfo";

interface PerformanceDatetimeInfoListProps {
  list: PerformanceDatetimeInfo[]
}

interface PerformanceDatetimeInfoListArgs {
  list: PerformanceDatetimeInfo[]
}

export class PerformanceDatetimeInfoList extends ValueObject<PerformanceDatetimeInfoListProps> {
  static create(args: PerformanceDatetimeInfoListArgs): PerformanceDatetimeInfoList {
    return new PerformanceDatetimeInfoList({
      list: args.list,
    });
  }

  get list() {
    return this._value.list
  }

  isEmpty(): boolean {
    return this.list.length === 0
  }

}