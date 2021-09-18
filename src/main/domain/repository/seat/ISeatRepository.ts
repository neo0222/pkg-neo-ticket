import { Seat } from "../../model/seat/Seat";
import { IRepositoryBase } from "../IRepositoryBase";

export interface ISeatRepository extends IRepositoryBase<Seat> {
  save(seat: Seat): Promise<void>
}