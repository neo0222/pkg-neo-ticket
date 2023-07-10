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

  split(splitSize: number): PerformanceDatetimeInfoList[] {
    const groups: PerformanceDatetimeInfo[][] = [];
    const length = this.list.length;
    const chunkSize = Math.ceil(length / splitSize);

    for (let i = 0; i < length; i += chunkSize) {
      const group: PerformanceDatetimeInfo[] = this.list.slice(i, i + chunkSize);
      groups.push(group);
    }
    return groups.map(list => {
      return new PerformanceDatetimeInfoList({
        list,
      })
    })
  }

  get list() {
    return this._value.list
  }

  isEmpty(): boolean {
    return this.list.length === 0
  }

  toString(): string {
    return JSON.stringify(this.list.map(info => {
      return {
        day: info.day.formatJp(),
        startTime: info.startTime.formatJp()
      }
    }))
  }

}