import { SeatsVacantPostController } from "../../../controller/seat/SeatsVacantPostController";
import { VacantSeatRepository } from "../../../infrastructure/seat/VacantSeatRepository";
import { ApiGatewayLambdaEvent } from "../../api-gateway/ApiGatewayLambdaEvent";
import { ApiGatewayLambdaResponse } from "../../api-gateway/ApiGatewayLambdaResponse";
import { LambdaFunction } from "../../LambdaFunction";
import { SeatsVacantPostRequestBody } from "./SeatsVacantPostRequestBody";
import { SeatsVacantPostResponseBody } from "./SeatsVacantPostResponseBody";

exports.handler = async (event, context) => {

  const controller = new SeatsVacantPostController(new VacantSeatRepository())
  const lambda = new LambdaFunction<ApiGatewayLambdaEvent<SeatsVacantPostRequestBody>, ApiGatewayLambdaResponse<SeatsVacantPostResponseBody>>(controller);

  return lambda.handler(event, context)
}