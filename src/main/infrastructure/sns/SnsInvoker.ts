
import AWS from "aws-sdk";
import { Nullable } from "../../common/Nullable";
import { SystemError } from "../../common/SystemError";
import { ISnsInvoker } from "../../gateway/ISnsInvoker";

const envName = process.env["ENV_NAME"]

export class SnsInvoker implements ISnsInvoker {
  
  sns: AWS.SNS

  constructor() {
    this.sns = new AWS.SNS({
      apiVersion: '2010-03-31',
      region: 'ap-northeast-1',
    })
  }

  async publish(subject: string, message: string): Promise<void> {
    const params: AWS.SNS.PublishInput = {
      Subject: subject,
      Message: message,
      TopicArn: process.env.NOTIFICATION_TOPIC_ARN
    }
    try {
      await this.sns.publish(params).promise()
    } catch (error) {
      console.error(error)
      throw SystemError.SNS_ACCESS_FAILED
    }
  }
}