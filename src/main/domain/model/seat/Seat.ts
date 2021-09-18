import { MatineeOrSoiree } from "../../value/performance/MatineeOrSoiree";
import { PerformanceCode } from "../../value/performance/PerformanceCode";
import { PerformanceDate } from "../../value/performance/PerformanceDate";
import { PerformanceId } from "../../value/performance/PerformanceId";
import { PerformanceName } from "../../value/performance/PerformanceName";
import { DetectionDatetime } from "../../value/seat/DetectionDatetime";
import { IsVacant } from "../../value/seat/IsVacant";
import { VacantSeatInfo } from "../../value/seat/VacantSeatInfo";
import { VacantSeatInfoList } from "../../value/seat/VacantSeatInfoList";
import { EntityBase } from "../EntityBase";

export class Seat extends EntityBase {
  performanceId: PerformanceId
  performanceCode: PerformanceCode
  performanceName: PerformanceName
  performanceDate: PerformanceDate
  matineeOrSoiree: MatineeOrSoiree
  seatInfo: VacantSeatInfo
  detectionDatetime: DetectionDatetime
  isVacant: IsVacant

  constructor(
    _performanceId: PerformanceId,
    _performanceCode: PerformanceCode,
    _performanceName: PerformanceName,
    _performanceDate: PerformanceDate,
    _matineeOrSoiree: MatineeOrSoiree,
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
    seatInfo: VacantSeatInfo,
    detectionDatetime: DetectionDatetime
  ) {
    return new Seat(
      performanceId,
      performanceCode,
      performanceName,
      performanceDate,
      matineeOrSoiree,
      seatInfo,
      detectionDatetime,
      IsVacant.create(true)
    )
  }
}