import { CrawlVacantSeatController } from "../../../controller/crawling/CrawlVacantSeatController";
import { CrawlingResultRepository } from "../../../infrastructure/crawling-result/CrawlingResultRepository";
import { CrawlingInvoker } from "../../../infrastructure/crawling/CrawlingInvoker";
import { S3Invoker } from "../../../infrastructure/s3/S3Invoker";
import { DetailType } from "../../event-bridge/DetailType";
import { EventBridgeLambdaEvent } from "../../event-bridge/EventBridgeLambdaEvent";
import { LambdaFunction } from "../../LambdaFunction";
import { BatchAssignCrawlingDetail } from "../detail/BatchAssignCrawlingDetail";
import { S3Event } from "aws-lambda";
import { PersistCrawlingResultController } from "../../../controller/crawling/PersistCrawlingResultController";

exports.handler = async (event, context) => {
  let controller
  let lambda

  controller = new PersistCrawlingResultController(
    new CrawlingInvoker(),
    new S3Invoker(),
    new CrawlingResultRepository()
  )
  lambda = new LambdaFunction<S3Event, any>(controller)

  return lambda.handler(event, context)
}