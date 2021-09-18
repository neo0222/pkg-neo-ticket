import { BatchAssignCrawlingController } from "../../../controller/crawling/BatchAssignCrawlingController";
import { CrawlingInvoker } from "../../../infrastructure/crawling/CrawlingInvoker";
import { EventBridgeInvoker } from "../../../infrastructure/event-bridge/EventBridgeInvoker";
import { EventBridgeLambdaEvent } from "../../event-bridge/EventBridgeLambdaEvent";
import { LambdaFunction } from "../../LambdaFunction";
import { BatchAssignCrawlingDetail } from "../detail/BatchAssignCrawlingDetail";

exports.handler = async (event, context) => {

  const controller = new BatchAssignCrawlingController(
    new CrawlingInvoker(),
    new EventBridgeInvoker()
  )
  const lambda = new LambdaFunction<EventBridgeLambdaEvent<BatchAssignCrawlingDetail>, any>(controller);

  return lambda.handler(event, context)
}