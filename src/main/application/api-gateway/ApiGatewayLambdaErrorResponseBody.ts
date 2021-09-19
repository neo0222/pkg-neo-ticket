import { BusinessError } from "../../common/BusinessError";
import { SystemError } from "../../common/SystemError";
import { IApiGatewayLambdaResponseBody } from "./IApiGatewayLambdaResponseBody";

export class ApiGatewayLambdaErrorResponseBody implements IApiGatewayLambdaResponseBody {
  error: BusinessError | SystemError | Error
  constructor(error: BusinessError | SystemError | Error) {
    this.error = error
  }
}