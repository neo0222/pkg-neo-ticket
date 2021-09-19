import { CrawlingResultRepository } from "../../../infrastructure/crawling-result/CrawlingResultRepository";
import { LambdaFunction } from "../../LambdaFunction";
import { DynamoDBStreamEvent } from "aws-lambda";
import { VacantSeatRepository } from "../../../infrastructure/seat/VacantSeatRepository";
import { UnvacantSeatRepository } from "../../../infrastructure/seat/UnvacantSeatRepository";
import { PersistUnvacantSeatController } from "../../../controller/seat/PersistUnvacantSeatController";

exports.handler = async (event, context) => {
  let controller
  let lambda

  controller = new PersistUnvacantSeatController(
    new CrawlingResultRepository(),
    new VacantSeatRepository(),
    new UnvacantSeatRepository()
  )
  lambda = new LambdaFunction<DynamoDBStreamEvent, any>(controller)

  return lambda.handler(event, context)
}