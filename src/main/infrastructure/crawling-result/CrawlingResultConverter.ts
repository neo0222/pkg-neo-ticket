import { CrawlingResult } from "../../domain/model/crawling-result/CrawlingResult";
import { CrawlingDatetime } from "../../domain/value/crawling/CrawlingDatetime";
import { PerformanceCode } from "../../domain/value/performance/PerformanceCode";
import { PerformanceDate } from "../../domain/value/performance/PerformanceDate";
import { PerformanceId } from "../../domain/value/performance/PerformanceId";
import { PerformanceName } from "../../domain/value/performance/PerformanceName";
import { VacantSeatInfo } from "../../domain/value/seat/VacantSeatInfo";
import { VacantSeatInfoList } from "../../domain/value/seat/VacantSeatInfoList";
import { IDtoConverter } from "../IDtoConverter";
import { CrawlingResultDto } from "./CrawlingResultDto";
import { VacantSeatInfoDto } from "./VacantSeatInfoDto";

export const CrawlingResultConverter = class CrawlingResultConverter implements IDtoConverter<CrawlingResultDto, CrawlingResult>{

  constructor() {}
  static toEntity(dto: CrawlingResultDto): CrawlingResult {
    return new CrawlingResult(
      PerformanceId.create(dto.performanceId),
      PerformanceCode.create(dto.performanceCode),
      PerformanceName.create(dto.performanceName),
      PerformanceDate.create(dto.performanceDate),
      dto.matineeOrSoiree,
      VacantSeatInfoList.create({
        list: dto.vacantSeatInfoList.map(vacantSeat => {
          return VacantSeatInfo.create({
            floor: vacantSeat.floor,
            row: vacantSeat.row,
            column: vacantSeat.column,
          })
        })
      })
    )
  }

  static toDto(entity: CrawlingResult): CrawlingResultDto {
    return new CrawlingResultDto(
      entity.performanceCode.value,
      `${entity.performanceCode}#${entity.performanceDate}#${entity.matineeOrSoiree}`,
      `${entity.performanceId}`,
      `${entity.performanceCode}`,
      `${entity.performanceName}`,
      `${entity.performanceDate}`,
      entity.matineeOrSoiree,
      entity.vacantSeatInfoList.list.map(vacantSeatInfo => {
        return new VacantSeatInfoDto(
          `${vacantSeatInfo.floor}#${vacantSeatInfo.row}#${vacantSeatInfo.column}`,
          `${vacantSeatInfo.floor}#${vacantSeatInfo.row}#${vacantSeatInfo.column}`,
          `${vacantSeatInfo.floor}`,
          `${vacantSeatInfo.row}`,
          `${vacantSeatInfo.column}`,
        )
      })
    )
  }
}