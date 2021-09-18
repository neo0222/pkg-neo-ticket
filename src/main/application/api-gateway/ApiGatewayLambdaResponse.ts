import { ApiGatewayLambdaErrorResponseBody } from "./ApiGatewayLambdaErrorResponseBody";
import { ILambdaResponse } from "../ILambdaResponse";
import { IApiGatewayLambdaResponseBody } from "./IApiGatewayLambdaResponseBody";

export class ApiGatewayLambdaResponse<T extends IApiGatewayLambdaResponseBody> implements ILambdaResponse {
  statusCode: number
  headers: object = {
    "Access-Control-Allow-Origin": '*'
  }
  isBase64Encoded: false
  body: string

  constructor(statusCode: number, bodyObj: T | ApiGatewayLambdaErrorResponseBody) {
    this.statusCode = statusCode
    this.body = JSON.stringify(bodyObj)
  }
}