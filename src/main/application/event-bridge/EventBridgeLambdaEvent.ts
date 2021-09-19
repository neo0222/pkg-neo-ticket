import { ILambdaEvent } from "../ILambdaEvent";
import { DetailType } from "./DetailType";
import { IEventBridgeLambdaDetail } from "./IEventBridgeLambdaDetail";

export class EventBridgeLambdaEvent<T extends IEventBridgeLambdaDetail> implements ILambdaEvent {
  time: string
  "detail-type": DetailType
  detail: T

  constructor(init?: Partial<EventBridgeLambdaEvent<T>>) {
    Object.assign(this, init)
  }
}