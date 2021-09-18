import { MatineeOrSoiree } from "../../domain/value/performance/MatineeOrSoiree";
import { IDto } from "../IDto";

export class SeatDto implements IDto {
  pk: string
  sk: string
  performanceId: string
  performanceCode: string
  performanceName: string
  performanceDate: string
  matineeOrSoiree: MatineeOrSoiree
  floor: string
  row: string
  column: string
  detectionDatetime: string
  isVacant: string

  constructor(
    _pk: string,
    _sk: string,
    _performanceId: string,
    _performanceCode: string,
    _performanceName: string,
    _performanceDate: string,
    _matineeOrSoiree: MatineeOrSoiree,
    _floor: string,
    _row: string,
    _column: string,
    _detectionDatetime: string,
    _isVacant: string
  ) {
    this.pk = _pk
    this.sk = _sk
    this.performanceId = _performanceId
    this.performanceCode = _performanceCode
    this.performanceName = _performanceName
    this.performanceDate = _performanceDate
    this.matineeOrSoiree = _matineeOrSoiree
    this.floor = _floor
    this.row = _row
    this.column = _column
    this.detectionDatetime = _detectionDatetime
    this.isVacant = _isVacant
  }
}