import { MatineeOrSoiree } from "../../domain/value/performance/MatineeOrSoiree";
import { ICrawlingInvoker } from "../../gateway/ICrawlingInvoker";
import { IDto } from "../IDto";
import { VacantSeatInfoDto } from "./VacantSeatInfoDto";

export class CrawlingResultDto implements IDto {
  pk: string
  sk: string
  performanceId: string
  performanceCode: string
  performanceName: string
  performanceDate: string
  matineeOrSoiree: MatineeOrSoiree
  performanceStartTime: string
  vacantSeatInfoList: VacantSeatInfoDto[]

  constructor(
    _pk: string,
    _sk: string,
    _performanceId: string,
    _performanceCode: string,
    _performanceName: string,
    _performanceDate: string,
    _matineeOrSoiree: MatineeOrSoiree,
    _performanceStartTime: string,
    _vacantSeatInfoList: VacantSeatInfoDto[],
  ) {
    this.pk = _pk
    this.sk = _sk
    this.performanceId = _performanceId
    this.performanceCode = _performanceCode
    this.performanceName = _performanceName
    this.performanceDate = _performanceDate
    this.matineeOrSoiree = _matineeOrSoiree
    this.performanceStartTime = _performanceStartTime
    this.vacantSeatInfoList = _vacantSeatInfoList
  }
}