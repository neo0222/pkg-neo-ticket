import AWS from "aws-sdk";
import { ServiceConfigurationOptions } from "aws-sdk/lib/service";
import { Optional } from "../../common/Optional";
import { SystemError } from "../../common/SystemError";
import { Seat } from "../../domain/model/seat/Seat";
import { ISeatRepository } from "../../domain/repository/seat/ISeatRepository";
import { MatineeOrSoiree } from "../../domain/value/performance/MatineeOrSoiree";
import { PerformanceCode } from "../../domain/value/performance/PerformanceCode";
import { PerformanceDate } from "../../domain/value/performance/PerformanceDate";
import { IsVacant } from "../../domain/value/seat/IsVacant";
import { DynamoAccessor } from "../util/DynamoAccessor";
import { SeatConverter } from "./SeatConverter";
import { SeatDto } from "./SeatDto";

export class UnvacantSeatRepository implements ISeatRepository {

  dynamoAccessor: DynamoAccessor

  private TABLE_NAME_PREFIX: string = 'SEAT'

  private tableName: string
  private docClient: AWS.DynamoDB.DocumentClient

  constructor() {
    const envName = process.env.ENV_NAME || 'local'
    this.tableName = `${this.TABLE_NAME_PREFIX}-${envName}`;

    if (envName === 'local') {
      const serviceConfigOptions: ServiceConfigurationOptions = {
        accessKeyId: 'dummy',
        secretAccessKey: 'dummy',
        endpoint: 'http://localhost:8000',
        region: 'ap-northeast-1',
      };
      AWS.config.update(serviceConfigOptions);
    };
    
    this.docClient = new AWS.DynamoDB.DocumentClient({
      region: process.env["AWS_REGION"] || 'ap-northeast-1',
    });
  }

  async save(seat: Seat): Promise<void> {
    const dto: SeatDto = SeatConverter.toDto(seat)
    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: this.tableName,
      ExpressionAttributeNames: {
        '#pk': 'pk',
        '#isVacant': 'isVacant',
      },
      ExpressionAttributeValues: {
        ':true': 'true',
      },
      Item: dto as AWS.DynamoDB.DocumentClient.ItemCollectionKeyAttributeMap,
      ConditionExpression: 'attribute_not_exists(#pk) OR #isVacant=:true'
    }
    try {
      await this.docClient.put(params).promise();
    }
    catch (error) {
      if (error.code === 'ConditionalCheckFailedException') {
        return
      }
      console.error(error)
      throw SystemError.DYNAMO_ACCESS_FAILED;
    }
  }

  async findByCodeAndDateAndMatineeOrSoiree(
    code: PerformanceCode,
    date: PerformanceDate,
    matineeOrSoiree: MatineeOrSoiree
  ): Promise<Optional<Seat[]>> {
    throw SystemError.DYNAMO_ACCESS_FAILED
  }

  async findByCode(code: PerformanceCode): Promise<Optional<Seat[]>> {
    throw SystemError.DYNAMO_ACCESS_FAILED
  }
}