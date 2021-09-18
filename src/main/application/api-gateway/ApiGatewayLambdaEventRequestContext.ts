import { ApiGatewayLambdaEventRequestContextAuthorizer } from "./ApiGatewayLambdaEventRequestContextAuthorizer"
import { ApiGatewayLambdaEventRequestContextHeaders } from "./ApiGatewayLambdaEventRequestContextHeaders"
import { ApiGatewayLambdaEventRequestContextIdentity } from "./ApiGatewayLambdaEventRequestContextIdentity"

export class ApiGatewayLambdaEventRequestContext {
  authorizer?: ApiGatewayLambdaEventRequestContextAuthorizer

  /**
   * Format: DD/MMM/YYYY:HH:mm:SS ZZ(e.g. 22/Jan/2021:03:19:17 +0000)
   */
  requestTime?: string

  resourcePath?: string

  identity?: ApiGatewayLambdaEventRequestContextIdentity

  constructor(init?: Partial<ApiGatewayLambdaEventRequestContext>) {
    Object.assign(this, init)
  }
}