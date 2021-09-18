import AWS from "aws-sdk";
import { ServiceConfigurationOptions } from "aws-sdk/lib/service";
import { CrawlingResult } from "../../domain/model/crawling-result/CrawlingResult";
import { ICrawlingResultRepository } from "../../domain/repository/crawling-result/ICrawlingResultRepository";
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

    this.dynamoAccessor = new DynamoAccessor();
  }

  async save(crawlingResult: CrawlingResult): Promise<void> {
    const dto: CrawlingResultDto = await this.dynamoAccessor
      .putItem<CrawlingResultDto>
        (CrawlingResultConverter.toDto(crawlingResult)) as CrawlingResultDto
  }
}