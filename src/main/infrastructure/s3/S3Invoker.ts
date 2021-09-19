
import AWS from "aws-sdk";
import { Nullable } from "../../common/Nullable";
import { SystemError } from "../../common/SystemError";
import { IS3Invoker } from "../../gateway/IS3Invoker";

const envName = process.env["ENV_NAME"]

export class S3Invoker implements IS3Invoker {
  
  s3: AWS.S3

  constructor() {
    this.s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      signatureVersion: 'v4', // sdkの不具合でv4を指定する必要あり
    })
  }

  async putObject(objectKey: string, body: string): Promise<void> {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: `neo-ticket-${envName}-crawling`,
      Key: objectKey,
      Body: body,
    }
    try {
      const url = await this.s3.putObject(params).promise()
    } catch (error) {
      console.error(error)
      throw SystemError.S3_ACCESS_FAILED
    }
  }

  async getObject(objectKey: string): Promise<Nullable<string>> {
    const params: AWS.S3.GetObjectRequest = {
      Bucket: `neo-ticket-${envName}-crawling`,
      Key: objectKey,
    }
    try {
      console.log(`getObject params: ${JSON.stringify(params)}`)
      const result: AWS.S3.GetObjectOutput = await this.s3.getObject(params).promise()
      return result.Body?.toString()
    } catch (error) {
      console.error(error)
      throw SystemError.S3_ACCESS_FAILED
    }
  }
}