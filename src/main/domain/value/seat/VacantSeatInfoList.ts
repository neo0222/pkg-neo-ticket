import { Seat } from "../../model/seat/Seat";
import { ValueObject } from "../ValueObject";
import { VacantSeatInfo } from "./VacantSeatInfo";

interface VacantSeatInfoListProps {
  list: VacantSeatInfo[]
}

interface VacantSeatInfoListArgs {
  list: VacantSeatInfo[]
}

export class VacantSeatInfoList extends ValueObject<VacantSeatInfoListProps> {
  static create(args: VacantSeatInfoListArgs): VacantSeatInfoList {
    return new VacantSeatInfoList({
      list: args.list,
    });
  }

  get list() {
    return this._value.list
  }

  isEmpty(): boolean {
    return this.list.length === 0
  }

  includes(seat: Seat): boolean {
    return this.list.some(vacantSeat => {
      return vacantSeat.equals(seat.seatInfo)
    })
  }

}