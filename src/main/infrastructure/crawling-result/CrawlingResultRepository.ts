import AWS from "aws-sdk";
import { ServiceConfigurationOptions } from "aws-sdk/lib/service";
import { Optional } from "../../common/Optional";
import { CrawlingResult } from "../../domain/model/crawling-result/CrawlingResult";
import { ICrawlingResultRepository } from "../../domain/repository/crawling-result/ICrawlingResultRepository";
import { MatineeOrSoiree } from "../../domain/value/performance/MatineeOrSoiree";
import { PerformanceCode } from "../../domain/value/performance/PerformanceCode";
import { PerformanceDate } from "../../domain/value/performance/PerformanceDate";
import { DynamoAccessor } from "../util/DynamoAccessor";
import { CrawlingResultConverter } from "./CrawlingResultConverter";
import { CrawlingResultDto } from "./CrawlingResultDto";

export class CrawlingResultRepository implements ICrawlingResultRepository {

  dynamoAccessor: DynamoAccessor

  private TABLE_NAME_PREFIX: string = 'CRAWLING_RESULT'

  private tableName: string

  constructor() {
    const envName = process.env.ENV_NAME || 'local'
    this.tableName = `${this.TABLE_NAME_PREFIX}-${envName}`;

    this.dynamoAccessor = new DynamoAccessor(this.tableName);
  }

  async save(crawlingResult: CrawlingResult): Promise<void> {
    const dto: CrawlingResultDto = await this.dynamoAccessor
      .putItem<CrawlingResultDto>
        (CrawlingResultConverter.toDto(crawlingResult)) as CrawlingResultDto
  }

  async findByCodeAndDateAndMatineeOrSoiree(
    code: PerformanceCode,
    date: PerformanceDate,
    matineeOrSoiree: MatineeOrSoiree
  ) : Promise<Optional<CrawlingResult>> {
    const dto: CrawlingResultDto = await this.dynamoAccessor.getItemByPkAndSk<CrawlingResultDto>(
      code.toString(),
      `${code.toString()}#${date.toString()}#${matineeOrSoiree}`
    )
    return Optional.ofNullable(dto ? CrawlingResultConverter.toEntity(dto) : undefined)
  }
}