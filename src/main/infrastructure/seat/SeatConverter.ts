import { Seat } from "../../domain/model/seat/Seat";
import { PerformanceCode } from "../../domain/value/performance/PerformanceCode";
import { PerformanceDate } from "../../domain/value/performance/PerformanceDate";
import { PerformanceId } from "../../domain/value/performance/PerformanceId";
import { PerformanceName } from "../../domain/value/performance/PerformanceName";
import { PerformanceStartTime } from "../../domain/value/performance/PerformanceStartTime";
import { DetectionDatetime } from "../../domain/value/seat/DetectionDatetime";
import { IsVacant } from "../../domain/value/seat/IsVacant";
import { VacantSeatInfo } from "../../domain/value/seat/VacantSeatInfo";
import { IDtoConverter } from "../IDtoConverter";
import { SeatDto } from "./SeatDto";

export const SeatConverter = class SeatConverter implements IDtoConverter<SeatDto, Seat>{

  constructor() {}
  static toEntity(dto: SeatDto): Seat {
    return new Seat(
      PerformanceId.create(dto.performanceId),
      PerformanceCode.create(dto.performanceCode),
      PerformanceName.create(dto.performanceName),
      PerformanceDate.create(dto.performanceDate),
      dto.matineeOrSoiree,
      PerformanceStartTime.create(dto.performanceStartTime),
      VacantSeatInfo.create({
        floor: dto.floor,
        row: dto.row,
        column: dto.column,
      }),
      DetectionDatetime.create(dto.detectionDatetime),
      IsVacant.create(dto.isVacant === 'true')
    )
  }

  static toDto(entity: Seat): SeatDto {
    return new SeatDto(
      entity.performanceCode.value,
      `${entity.performanceCode}#${entity.performanceDate}#${entity.matineeOrSoiree}#${entity.seatInfo.floor}#${entity.seatInfo.row}#${entity.seatInfo.column}`,
      `${entity.performanceId}`,
      `${entity.performanceCode}`,
      `${entity.performanceName}`,
      `${entity.performanceDate}`,
      entity.matineeOrSoiree,
      `${entity.performanceStartTime}`,
      `${entity.seatInfo.floor}`,
      `${entity.seatInfo.row}`,
      `${entity.seatInfo.column}`,
      `${entity.detectionDatetime}`,
      `${entity.isVacant}`
    )
  }
}