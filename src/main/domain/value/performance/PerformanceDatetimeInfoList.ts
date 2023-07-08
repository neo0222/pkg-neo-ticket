import { ValueObject } from "../ValueObject";
import { PerformanceDatetimeInfo } from "./PerformanceDatetimeInfo";

interface PerformanceDatetimeInfoListProps {
  list: PerformanceDatetimeInfo[]
}

interface PerformanceDatetimeInfoListArgs {
  list: PerformanceDatetimeInfo[]
}

export class PerformanceDatetimeInfoList extends ValueObject<PerformanceDatetimeInfoListProps> {
  private SPLIT_SIZE: number = 5
  static create(args: PerformanceDatetimeInfoListArgs): PerformanceDatetimeInfoList {
    return new PerformanceDatetimeInfoList({
      list: args.list,
    });
  }

  split(): PerformanceDatetimeInfoList[] {
    const groups: PerformanceDatetimeInfo[][] = [];
    const length = this.list.length;
    const chunkSize = Math.ceil(length / this.SPLIT_SIZE);

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

}