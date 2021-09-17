import { DetailType } from "../application/event-bridge/DetailType";
import { IEventBridgeLambdaDetail } from "../application/event-bridge/IEventBridgeLambdaDetail";

export interface IEventBridgeInvoker {
  putEvents(detailType: DetailType, detail: IEventBridgeLambdaDetail): Promise<void>
}