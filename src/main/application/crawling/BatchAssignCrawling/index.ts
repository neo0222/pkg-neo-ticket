import { BatchCreateScheduleController } from "../../../controller/schedule/BatchCreateScheduleController";
import { BoyRepository } from "../../../infrastructure/boy/BoyRepository";
import { ScheduleRepository } from "../../../infrastructure/schedule/ScheduleRepository";
import { EventBridgeLambdaEvent } from "../../event-bridge/EventBridgeLambdaEvent";
import { LambdaFunction } from "../../LambdaFunction";
import { BatchCreateScheduleDetail } from "./BatchCreateScheduleDetail";

exports.handler = async (event, context) => {

  const controller = new BatchCreateScheduleController(new ScheduleRepository(), new BoyRepository())
  const lambda = new LambdaFunction<EventBridgeLambdaEvent<BatchCreateScheduleDetail>, any>(controller);

  return lambda.handler(event, context)
}