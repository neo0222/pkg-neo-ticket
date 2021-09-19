import { ICrawlingInvoker } from "../../gateway/ICrawlingInvoker";
import { IDto } from "../IDto";

export class VacantSeatInfoDto implements IDto {
  pk: string
  sk: string
  floor: string
  row: string
  column: string

  constructor(
    _pk: string,
    _sk: string,
    _floor: string,
    _row: string,
    _column: string
  ) {
    this.pk = _pk
    this.sk = _sk
    this.floor = _floor
    this.row = _row
    this.column = _column
  }
}