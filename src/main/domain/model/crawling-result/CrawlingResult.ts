import { MatineeOrSoiree } from "../../value/performance/MatineeOrSoiree";
import { PerformanceCode } from "../../value/performance/PerformanceCode";
import { PerformanceDate } from "../../value/performance/PerformanceDate";
import { PerformanceId } from "../../value/performance/PerformanceId";
import { PerformanceName } from "../../value/performance/PerformanceName";
import { VacantSeatInfoList } from "../../value/seat/VacantSeatInfoList";
import { EntityBase } from "../EntityBase";

export class CrawlingResult extends EntityBase {
  performanceId: PerformanceId
  performanceCode: PerformanceCode
  performanceName: PerformanceName
  performanceDate: PerformanceDate
  matineeOrSoiree: MatineeOrSoiree
  vacantSeatInfoList: VacantSeatInfoList

  constructor(
    _performanceId: PerformanceId,
    _performanceCode: PerformanceCode,
    _performanceName: PerformanceName,
    _performanceDate: PerformanceDate,
    _matineeOrSoiree: MatineeOrSoiree,
    _vacantSeatInfoList: VacantSeatInfoList
  ) {
    super()
    this.performanceId = _performanceId
    this.performanceCode = _performanceCode
    this.performanceName = _performanceName
    this.performanceDate = _performanceDate
    this.matineeOrSoiree = _matineeOrSoiree
    this.vacantSeatInfoList = _vacantSeatInfoList
  }
}