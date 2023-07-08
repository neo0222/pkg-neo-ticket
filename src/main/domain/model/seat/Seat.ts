import { MatineeOrSoiree } from "../../value/performance/MatineeOrSoiree";
import { PerformanceCode } from "../../value/performance/PerformanceCode";
import { PerformanceDate } from "../../value/performance/PerformanceDate";
import { PerformanceId } from "../../value/performance/PerformanceId";
import { PerformanceName } from "../../value/performance/PerformanceName";
import { PerformanceStartTime } from "../../value/performance/PerformanceStartTime";
import { DetectionDatetime } from "../../value/seat/DetectionDatetime";
import { IsVacant } from "../../value/seat/IsVacant";
import { VacantSeatInfo } from "../../value/seat/VacantSeatInfo";
import { EntityBase } from "../EntityBase";

export class Seat extends EntityBase {
  performanceId: PerformanceId
  performanceCode: PerformanceCode
  performanceName: PerformanceName
  performanceDate: PerformanceDate
  matineeOrSoiree: MatineeOrSoiree
  performanceStartTime: PerformanceStartTime
  seatInfo: VacantSeatInfo
  detectionDatetime: DetectionDatetime
  isVacant: IsVacant

  constructor(
    _performanceId: PerformanceId,
    _performanceCode: PerformanceCode,
    _performanceName: PerformanceName,
    _performanceDate: PerformanceDate,
    _matineeOrSoiree: MatineeOrSoiree,
    _performanceStartTime: PerformanceStartTime,
    _seatInfo: VacantSeatInfo,
    _detectionDatetime: DetectionDatetime,
    _isVacant: IsVacant
  ) {
    super()
    this.performanceId = _performanceId
    this.performanceCode = _performanceCode
    this.performanceName = _performanceName
    this.performanceDate = _performanceDate
    this.matineeOrSoiree = _matineeOrSoiree
    this.performanceStartTime = _performanceStartTime
    this.seatInfo = _seatInfo
    this.detectionDatetime = _detectionDatetime
    this.isVacant = _isVacant
  }

  static create(
    performanceId: PerformanceId,
    performanceCode: PerformanceCode,
    performanceName: PerformanceName,
    performanceDate: PerformanceDate,
    matineeOrSoiree: MatineeOrSoiree,
    performanceStartTime: PerformanceStartTime,
    seatInfo: VacantSeatInfo,
    detectionDatetime: DetectionDatetime
  ) {
    return new Seat(
      performanceId,
      performanceCode,
      performanceName,
      performanceDate,
      matineeOrSoiree,
      performanceStartTime,
      seatInfo,
      detectionDatetime,
      IsVacant.create(true)
    )
  }

  makeUnvacant(detectionDatetime: DetectionDatetime): void {
    this.isVacant = IsVacant.create(false)
    this.detectionDatetime = detectionDatetime
  }

  isAppropriate(): boolean {
    if (this.performanceCode.value === '2007') {
      return this.seatInfo.row.isEqualOrLessThan(9) && this.seatInfo.column.isEqualOrGreaterThan(39) && this.seatInfo.column.isEqualOrLessThan(57)
    }
    if (this.performanceCode.value === '3017') {
      return this.seatInfo.row.isEqualOrLessThan(9) && this.seatInfo.column.isEqualOrGreaterThan(39) && this.seatInfo.column.isEqualOrLessThan(57)
    }
    if (this.performanceId.value === 'frozen') {
      return (this.seatInfo.floor.value === '2' && this.seatInfo.row.isEqualOrLessThan(1) && this.seatInfo.column.isEqualOrGreaterThan(15) && this.seatInfo.column.isEqualOrLessThan(28))
      || (this.seatInfo.floor.value === '1' && this.seatInfo.row.isEqualOrLessThan(10) && this.seatInfo.column.isEqualOrGreaterThan(15) && this.seatInfo.column.isEqualOrLessThan(28))
      || (this.seatInfo.floor.value === '2' && this.seatInfo.row.isEqualOrGreaterThan(14))
    }
    // return (this.seatInfo.floor.isEqualOrLessThan(1) && this.seatInfo.row.isEqualOrLessThan(10) && this.seatInfo.column.isEqualOrGreaterThan(15) && this.seatInfo.column.isEqualOrLessThan(28))
    //  || (this.seatInfo.floor.value === '2' && this.seatInfo.row.isEqualOrLessThan(1) && this.seatInfo.column.isEqualOrGreaterThan(15) && this.seatInfo.column.isEqualOrLessThan(28))
    return this.performanceCode.value === '3009'
  }
}