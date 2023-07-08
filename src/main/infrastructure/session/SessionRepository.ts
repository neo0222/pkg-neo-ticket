import { Optional } from "../../common/Optional";
import { Session } from "../../domain/model/session/Session";
import { ISessionRepository } from "../../domain/repository/session/ISessionRepository";
import { DynamoAccessor } from "../util/DynamoAccessor";
import { SessionConverter } from "./SessionConverter";
import { SessionDto } from "./SessionDto";

export class SessionRepository implements ISessionRepository {

  dynamoAccessor: DynamoAccessor

  private TABLE_NAME_PREFIX: string = 'SESSION'

  private tableName: string

  constructor() {
    const envName = process.env.ENV_NAME || 'local'
    this.tableName = `${this.TABLE_NAME_PREFIX}-${envName}`;

    this.dynamoAccessor = new DynamoAccessor(this.tableName);
  }

  async save(session: Session): Promise<void> {
    const dto: SessionDto = await this.dynamoAccessor
      .putItem<SessionDto>
        (SessionConverter.toDto(session)) as SessionDto
  }
  
  async findBySkSession(skSession: string): Promise<Optional<Session>> {
    const dto: SessionDto = await this.dynamoAccessor.getItemByPk<SessionDto>(
      skSession,
    )
    return Optional.ofNullable(dto ? SessionConverter.toEntity(dto) : undefined)
  }
}