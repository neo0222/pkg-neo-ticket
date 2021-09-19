import { ValueObject } from "../ValueObject";
import { SeatColumn } from "./SeatColumn";
import { SeatFloor } from "./SeatFloor";
import { SeatRow } from "./SeatRow";

interface VacantSeatInfoProps {
  floor: SeatFloor
  row: SeatRow
  column: SeatColumn
}

interface VacantSeatInfoArgs {
  floor: string
  row: string
  column: string
}

export class VacantSeatInfo extends ValueObject<VacantSeatInfoProps> {
  static create(args: VacantSeatInfoArgs): VacantSeatInfo {
    return new VacantSeatInfo({
      floor: SeatFloor.create(args.floor),
      row: SeatRow.create(args.row),
      column: SeatColumn.create(args.column),
    });
  }

  get floor() {
    return this._value.floor
  }

  get row() {
    return this._value.row
  }

  get column() {
    return this._value.column
  }

  get format() {
    return `${this.floor}階${this.row}列${this.column}番`
  }

  equals(other: VacantSeatInfo): boolean {
    return this.floor.equals(other.floor) && this.row.equals(other.row) && this.column.equals(other.column)
  }

}