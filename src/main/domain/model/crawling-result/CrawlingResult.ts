import { MatineeOrSoiree } from "../../value/performance/MatineeOrSoiree";
import { PerformanceCode } from "../../value/performance/PerformanceCode";
import { PerformanceDate } from "../../value/performance/PerformanceDate";
import { PerformanceId } from "../../value/performance/PerformanceId";
import { PerformanceName } from "../../value/performance/PerformanceName";
import { EntityBase } from "../EntityBase";

export class CrawlingResult extends EntityBase {
  performanceId: PerformanceId
  performanceCode: PerformanceCode
  performanceName: PerformanceName
  performanceDate: PerformanceDate
  matineeOrSoiree: MatineeOrSoiree
  vacantSeatInfoList: VacantSeatInfoList
}