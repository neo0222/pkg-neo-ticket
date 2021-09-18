import * as AWS from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { SystemError } from '../../common/SystemError';
import { IDto } from '../IDto';

export class DynamoAccessor {

  private docClient: AWS.DynamoDB.DocumentClient

  private tableName: string

  constructor(
    tableName: string
  ) {
    this.tableName = tableName;

    const envName = process.env.ENV_NAME || 'local'
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

  async getItemByPkAndSk<T extends IDto>(pk: string, sk: string): Promise<T> {
    const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
      TableName: this.tableName,
      Key: {
        pk: pk,
        sk: sk,
      },
    }
    try {
      const result: AWS.DynamoDB.DocumentClient.GetItemOutput = await this.docClient.get(params).promise();
      return result.Item as T;
    }
    catch (error) {
      console.error(error)
      throw new Error("DynamoAccessError");
    }
  }

  async queryByPkAndSkRange<T extends IDto>(pk: string, skMin: string, skMax: string): Promise<T[]> {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: this.tableName,
      ExpressionAttributeNames:{
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues:{
        ':pk': pk,
        ':skMin': skMin,
        ':skMax': skMax,
      },
      KeyConditionExpression: '#pk = :pk AND #sk BETWEEN :skMin AND :skMax',
    };

    try {
      const result: AWS.DynamoDB.DocumentClient.QueryOutput = await this.docClient.query(params).promise();
      return result.Items as T[];
    }
    catch (error: any) {
      console.error(error)
      throw SystemError.DYNAMO_ACCESS_FAILED
    }
  }

  async queryBySkAndIsEnrolled<T extends IDto>(sk: string, isEnrolled: string): Promise<T[]> {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: this.tableName,
      IndexName: 'sk-isEnrolled-index',
      ExpressionAttributeNames:{
        '#sk': 'sk',
        '#isEnrolled': 'isEnrolled',
      },
      ExpressionAttributeValues:{
        ':sk': 'latest#boy',
        ':isEnrolled': isEnrolled,
      },
      KeyConditionExpression: '#sk = :sk AND #isEnrolled = :isEnrolled',
    };

    try {
      const result: AWS.DynamoDB.DocumentClient.QueryOutput = await this.docClient.query(params).promise();
      return result.Items as T[];
    }
    catch (error: any) {
      console.error(error)
      throw SystemError.DYNAMO_ACCESS_FAILED
    }
  }

  async queryByEntityAndSkRange<T extends IDto>(entity: string, skMin: string, skMax: string): Promise<T[]> {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: this.tableName,
      IndexName: 'entity-sk-index',
      ExpressionAttributeNames:{
        '#entity': 'entity',
        '#sk': 'sk',
      },
      ExpressionAttributeValues:{
        ':entity': entity,
        ':skMin': skMin,
        ':skMax': skMax,
      },
      KeyConditionExpression: '#entity = :entity AND #sk BETWEEN :skMin AND :skMax',
    };

    try {
      const result: AWS.DynamoDB.DocumentClient.QueryOutput = await this.docClient.query(params).promise();
      return result.Items as T[];
    }
    catch (error: any) {
      console.error(error)
      throw SystemError.DYNAMO_ACCESS_FAILED
    }
  }

  async queryByEntityAndSkPrefix<T extends IDto>(entity: string, skPrefix: string): Promise<T[]> {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: this.tableName,
      IndexName: 'entity-sk-index',
      ExpressionAttributeNames:{
        '#entity': 'entity',
        '#sk': 'sk',
      },
      ExpressionAttributeValues:{
        ':entity': entity,
        ':skPrefix': skPrefix,
      },
      KeyConditionExpression: '#entity = :entity AND begins_with(#sk, :skPrefix)',
    };

    try {
      const result: AWS.DynamoDB.DocumentClient.QueryOutput = await this.docClient.query(params).promise();
      return result.Items as T[];
    }
    catch (error: any) {
      console.error(error)
      throw SystemError.DYNAMO_ACCESS_FAILED
    }
  }

  async queryByPkAndSkPrefix<T extends IDto>(pk: string, skPrefix: string): Promise<T[]> {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: this.tableName,
      ExpressionAttributeNames:{
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues:{
        ':pk': pk,
        ':skPrefix': skPrefix,
      },
      KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :skPrefix)',
    };

    try {
      const result: AWS.DynamoDB.DocumentClient.QueryOutput = await this.docClient.query(params).promise();
      return result.Items as T[];
    }
    catch (error: any) {
      console.error(error)
      throw SystemError.DYNAMO_ACCESS_FAILED
    }
  }

  async putItem<T extends IDto>(item: T): Promise<T> {
    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: this.tableName,
      Item: item as AWS.DynamoDB.DocumentClient.ItemCollectionKeyAttributeMap,
    }
    try {
      const result: AWS.DynamoDB.DocumentClient.PutItemOutput = await this.docClient.put(params).promise();
      return item as T
    }
    catch (error) {
      console.error(error)
      throw SystemError.DYNAMO_ACCESS_FAILED;
    }
  }

  async queryMaximumItemByPkAndSkMax<T extends IDto>(pk: string, skMax: string): Promise<T> {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: this.tableName,
      ExpressionAttributeNames:{
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues:{
        ':pk': pk,
        ':skMax': skMax,
      },
      KeyConditionExpression: '#pk = :pk AND #sk <= :skMax',
      Limit: 1, // 1つしか取得しない
      ScanIndexForward: false // 降順で取得
    };

    try {
      const result: AWS.DynamoDB.DocumentClient.QueryOutput = await this.docClient.query(params).promise();
      if (!result.Items) throw SystemError.DYNAMO_ACCESS_FAILED
      return result.Items[0] as T;
    }
    catch (error: any) {
      console.error(error)
      throw SystemError.DYNAMO_ACCESS_FAILED
    }
  }

  async scanByEntity<T extends IDto>(entity: string): Promise<T[]> {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: this.tableName,
      IndexName: 'entity-sk-index',
      ExpressionAttributeNames:{
        '#entity': 'entity',
      },
      ExpressionAttributeValues:{
        ':entity': entity,
      },
      KeyConditionExpression: '#entity = :entity',
    };

    try {
      const result: AWS.DynamoDB.DocumentClient.QueryOutput = await this.docClient.query(params).promise();
      return result.Items as T[];
    }
    catch (error: any) {
      console.error(error)
      throw SystemError.DYNAMO_ACCESS_FAILED
    }
  }

  async getMaximumItemByPkAndSkPrefix<T extends IDto>(pk: string, skPrefix: string): Promise<T> {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: this.tableName,
      ExpressionAttributeNames:{
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues:{
        ':pk': pk,
        ':skMax': skPrefix,
      },
      KeyConditionExpression: '#pk = :pk AND begins_with(#sk, :skMax)',
      Limit: 1, // 1つしか取得しない
      ScanIndexForward: false // 降順で取得
    };

    try {
      const result: AWS.DynamoDB.DocumentClient.QueryOutput = await this.docClient.query(params).promise();
      if (!result.Items) throw SystemError.DYNAMO_ACCESS_FAILED
      return result.Items[0] as T;
    }
    catch (error: any) {
      console.error(error)
      throw SystemError.DYNAMO_ACCESS_FAILED
    }
  }

  async getMinimumItemByPkAndSkRange<T extends IDto>(pk: string, skMin: string, skMax: string): Promise<T> {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: this.tableName,
      ExpressionAttributeNames:{
        '#pk': 'pk',
        '#sk': 'sk',
      },
      ExpressionAttributeValues:{
        ':pk': pk,
        ':skMin': skMin,       // ここは超えていてほしいという値
        ':skMax': skMax, // entityを絞り込む
      },
      KeyConditionExpression: '#pk = :pk AND #sk BETWEEN :skMin AND :skMax',
      Limit: 1, // 1つしか取得しない
      ScanIndexForward: true // 昇順で取得
    };

    try {
      const result: AWS.DynamoDB.DocumentClient.QueryOutput = await this.docClient.query(params).promise();
      if (!result.Items) throw SystemError.DYNAMO_ACCESS_FAILED
      return result.Items[0] as T;
    }
    catch (error: any) {
      console.error(error)
      throw SystemError.DYNAMO_ACCESS_FAILED
    }
  }
}