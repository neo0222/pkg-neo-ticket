import { IApiGatewayLambdaRequestBody } from "../../api-gateway/IApiGatewayLambdaRequestBody"

export class SeatsVacantPostRequestBody implements IApiGatewayLambdaRequestBody {
  performanceId: string
  accessKey: string
}