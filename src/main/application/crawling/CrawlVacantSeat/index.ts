import { CrawlVacantSeatController } from "../../../controller/crawling/CrawlVacantSeatController";
import { CrawlingResultRepository } from "../../../infrastructure/crawling-result/CrawlingResultRepository";
import { CrawlingInvoker } from "../../../infrastructure/crawling/CrawlingInvoker";
import { S3Invoker } from "../../../infrastructure/s3/S3Invoker";
import { SessionRepository } from "../../../infrastructure/session/SessionRepository";
import { DetailType } from "../../event-bridge/DetailType";
import { EventBridgeLambdaEvent } from "../../event-bridge/EventBridgeLambdaEvent";
import { LambdaFunction } from "../../LambdaFunction";
import { BatchAssignCrawlingDetail } from "../detail/BatchAssignCrawlingDetail";

exports.handler = async (event, context) => {
  let controller
  let lambda

  switch (event['detail-type']) {
    case DetailType.AssignCrawling:
      controller = new CrawlVacantSeatController(
        new CrawlingInvoker(),
        new S3Invoker(),
        new CrawlingResultRepository(),
        new SessionRepository(),
      )
      lambda = new LambdaFunction<EventBridgeLambdaEvent<BatchAssignCrawlingDetail>, any>(controller)
      break
    default:
      break
  }

  return lambda.handler(event, context)
}