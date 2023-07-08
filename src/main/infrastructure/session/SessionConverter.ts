import { Session } from "../../domain/model/session/Session";
import { SessionGoal } from "../../domain/value/session/SessionGoal";
import { IDtoConverter } from "../IDtoConverter";
import { SessionDto } from "./SessionDto";

export const SessionConverter = class SessionConverter implements IDtoConverter<SessionDto, Session>{

  constructor() {}
  static toEntity(dto: SessionDto): Session {
    return new Session(
      dto.skSession,
      dto.bigIpKeyValueJoinWithEqual,
      dto.headersForPost,
      dto.headersForHtml,
      dto.isReady,
      SessionGoal.create({
        performanceCode: dto.performanceCode,
        koenki: dto.koenki,
        yyyymm: dto.yyyymm,
      }),
    )
  }

  static toDto(entity: Session): SessionDto {
    return new SessionDto(
      entity.skSession,
      entity.skSession,
      entity.bigIpKeyValueJoinWithEqual,
      entity.headersForPost,
      entity.headersForHtml,
      entity.isReady,
      entity.sessionGoal.performanceCode.value,
      entity.sessionGoal.koenki,
      entity.sessionGoal.yyyymm,
    )
  }
}