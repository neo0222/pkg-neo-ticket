import { LambdaFunction } from "../../LambdaFunction";
import { DynamoDBStreamEvent } from "aws-lambda";
import { GrowUpSessionController } from "../../../controller/crawling/GrowUpSessionController";
import { SessionRepository } from "../../../infrastructure/session/SessionRepository";
import { CrawlingInvoker } from "../../../infrastructure/crawling/CrawlingInvoker";

exports.handler = async (event, context) => {
  let controller
  let lambda

  controller = new GrowUpSessionController(
    new SessionRepository(),
    new CrawlingInvoker(),
  )
  lambda = new LambdaFunction<DynamoDBStreamEvent, any>(controller)

  return lambda.handler(event, context)
}