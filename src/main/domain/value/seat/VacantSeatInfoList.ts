import { UsageType } from "../../model/enum/UsageType";
import { ValueObject } from "../ValueObject";
import { IReservationAvailabilityInfo } from "./IReservationAvailabilityInfo";
import { ReservationAvailabilityInfoForDelivery } from "./ReservationAvailabilityInfoForDelivery";
import { ReservationAvailabilityInfoForPrivateRoom } from "./ReservationAvailabilityInfoForPrivateRoom";
import { ReservationAvailableDatetime } from "./ReservationAvailableDatetime";
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

}