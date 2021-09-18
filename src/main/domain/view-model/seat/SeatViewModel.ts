import { Seat } from "../../model/seat/Seat"

export class SeatViewModel {
  name: string
  date: string
  startTime: string
  seat: string

  static of(seat: Seat): SeatViewModel {
    return new SeatViewModel(seat)
  }

  constructor(seat: Seat) {
    this.name = `${seat.performanceName}`
    this.date = seat.performanceDate.formatJp()
    this.startTime = seat.performanceStartTime.formatJp()
    this.seat = seat.seatInfo.format
  }
}