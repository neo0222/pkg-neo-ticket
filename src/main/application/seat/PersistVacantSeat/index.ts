import { CrawlingResultRepository } from "../../../infrastructure/crawling-result/CrawlingResultRepository";
import { LambdaFunction } from "../../LambdaFunction";
import { DynamoDBStreamEvent } from "aws-lambda";
import { PersistVacantSeatController } from "../../../controller/seat/PersistVacantSeatController";
import { VacantSeatRepository } from "../../../infrastructure/seat/VacantSeatRepository";
import { SnsInvoker } from "../../../infrastructure/sns/SnsInvoker";

exports.handler = async (event, context) => {
  let controller
  let lambda

  controller = new PersistVacantSeatController(
    new CrawlingResultRepository(),
    new VacantSeatRepository(),
    new SnsInvoker(),
  )
  lambda = new LambdaFunction<DynamoDBStreamEvent, any>(controller)

  return lambda.handler(event, context)
}