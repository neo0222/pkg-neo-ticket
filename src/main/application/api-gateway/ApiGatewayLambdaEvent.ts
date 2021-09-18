import { ILambdaEvent } from "../ILambdaEvent";
import { ApiGatewayLambdaEventRequestContext } from "./ApiGatewayLambdaEventRequestContext";
import { ApiGatewayLambdaEventRequestContextHeaders } from "./ApiGatewayLambdaEventRequestContextHeaders";
import { IApiGatewayLambdaRequestBody } from "./IApiGatewayLambdaRequestBody";

export class ApiGatewayLambdaEvent<T extends IApiGatewayLambdaRequestBody> implements ILambdaEvent {
  requestContext?: ApiGatewayLambdaEventRequestContext
  body: string

  headers?: ApiGatewayLambdaEventRequestContextHeaders
  methodArn?: string

  constructor(init?: Partial<ApiGatewayLambdaEvent<T>>) {
    Object.assign(this, init)
  }
}