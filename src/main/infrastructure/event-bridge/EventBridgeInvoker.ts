import AWS from "aws-sdk";
import { DetailType } from "../../application/event-bridge/DetailType";
import { IEventBridgeLambdaDetail } from "../../application/event-bridge/IEventBridgeLambdaDetail";
import { SystemError } from "../../common/SystemError";
import { IEventBridgeInvoker } from "../../gateway/IEventBridgeInvoker";

const envName = process.env["ENV_NAME"]
const eventBusName = `blast-${envName}-event-bus`

export class EventBridgeInvoker implements IEventBridgeInvoker {

  eventBridge: AWS.EventBridge

  constructor() {
    this.eventBridge = new AWS.EventBridge({
      region: 'ap-northeast-1',
    });
  }

  async putEvents(detailType: DetailType, detail: IEventBridgeLambdaDetail): Promise<void> {
    if (envName === "local") {
      console.log(`method putEvents invoked. detailType: ${detailType}, detail: ${detail}`)
      return
    }
    const entries: AWS.EventBridge.PutEventsRequestEntryList = []
    const entry: AWS.EventBridge.PutEventsRequestEntry = {
      Detail: JSON.stringify(detail),
      DetailType: detailType,
      EventBusName: eventBusName,
      Source: "source",
    }
    entries.push(entry)
    const params: AWS.EventBridge.PutEventsRequest = {
      Entries: entries,
    }
    try {
      const result: AWS.EventBridge.PutEventsResponse = await this.eventBridge.putEvents(params).promise()
      console.log(`method putEvents invoked. params: ${JSON.stringify(params)}, result: ${JSON.stringify(result)}`)
    } catch (error) {
      console.error(error)
      console.error(`method putEvents failed. detailType: ${detailType}, detail: ${JSON.stringify(detail)}`)
      throw SystemError.EVENT_BRIDGE_ACCESS_FAILED
    }
  }

}