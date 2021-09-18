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

export class VacantSeatRepository implements ISeatRepository {

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
      Item: dto as AWS.DynamoDB.DocumentClient.ItemCollectionKeyAttributeMap,
      ConditionExpression: 'attribute_not_exists(#pk) OR attribute_not_exists(#isVacant)'
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
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: this.tableName,
      IndexName: 'isVacant-sk-index',
      ExpressionAttributeNames:{
        '#isVacant': 'isVacant',
        '#sk': 'sk',
      },
      ExpressionAttributeValues:{
        ':true': 'true',
        ':skPrefix': `${code.toString()}#${date.toString()}#${matineeOrSoiree}`,
      },
      KeyConditionExpression: '#isVacant = :true AND begins_with(#sk, :skPrefix)',
    };

    try {
      const result: AWS.DynamoDB.DocumentClient.QueryOutput = await this.docClient.query(params).promise();
      return Optional.ofNullable(result.Items ? result.Items.map(dto => SeatConverter.toEntity(dto as SeatDto)) : undefined);
    }
    catch (error: any) {
      console.error(error)
      throw SystemError.DYNAMO_ACCESS_FAILED
    }
  }

  async findByCode(code: PerformanceCode): Promise<Optional<Seat[]>> {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: this.tableName,
      IndexName: 'pk-isVacant-index',
      ExpressionAttributeNames:{
        '#pk': 'pk',
        '#isVacant': 'isVacant',
      },
      ExpressionAttributeValues:{
        ':pk': `${code}`,
        ':true': 'true',
      },
      KeyConditionExpression: '#pk = :pk AND #isVacant = :true',
    };

    let dtoList: SeatDto[] = []
    try {
      while (true) {
        const result: AWS.DynamoDB.DocumentClient.QueryOutput = await this.docClient.query(params).promise();
        if (!result.Items) throw SystemError.DYNAMO_ACCESS_FAILED
        dtoList = dtoList.concat(result.Items as SeatDto[])
        if (!result.LastEvaluatedKey) break
        params.ExclusiveStartKey = result.LastEvaluatedKey
      }
      return Optional.ofNullable(dtoList.map(dto => SeatConverter.toEntity(dto)))
    }
    catch (error: any) {
      console.error(error)
      throw SystemError.DYNAMO_ACCESS_FAILED
    }
  }
}