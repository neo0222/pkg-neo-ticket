import { ApiGatewayLambdaErrorResponseBody } from "../../application/api-gateway/ApiGatewayLambdaErrorResponseBody";
import { ApiGatewayLambdaEvent } from "../../application/api-gateway/ApiGatewayLambdaEvent";
import { ApiGatewayLambdaResponse } from "../../application/api-gateway/ApiGatewayLambdaResponse";
import { SeatsVacantPostRequestBody } from "../../application/seat/SeatsVacantPost/SeatsVacantPostRequestBody";
import { SeatsVacantPostResponseBody } from "../../application/seat/SeatsVacantPost/SeatsVacantPostResponseBody";
import { Seat } from "../../domain/model/seat/Seat";
import { ISeatRepository } from "../../domain/repository/seat/ISeatRepository";
import { PerformanceCode } from "../../domain/value/performance/PerformanceCode";
import { SeatViewModel } from "../../domain/view-model/seat/SeatViewModel";
import { IController } from "../IController";

export class SeatsVacantPostController implements IController {
  vacantSeatRepository: ISeatRepository

  constructor(
    vacantSeatRepository: ISeatRepository) {
    this.vacantSeatRepository = vacantSeatRepository
  }

  async execute(event: ApiGatewayLambdaEvent<SeatsVacantPostRequestBody>): Promise<ApiGatewayLambdaResponse<SeatsVacantPostResponseBody>> {
    try {
      const { performanceId, accessKey, }: SeatsVacantPostRequestBody = JSON.parse(event.body)

      const performanceCode: PerformanceCode = this.convertIdToCode(performanceId) // TODO: 今後マスタ管理する
      const vacantSeatList: Seat[] = (await this.vacantSeatRepository.findByCode(performanceCode)).get()
      const seatList: SeatViewModel[] = vacantSeatList.filter(seat => seat.isAppropriate()).map(entity => SeatViewModel.of(entity))
      return new ApiGatewayLambdaResponse<SeatsVacantPostResponseBody>(200, {
        size: seatList.length,
        seatList,
      })
    } catch (error) {
      console.error(error)
      return new ApiGatewayLambdaResponse<ApiGatewayLambdaErrorResponseBody>(400, new ApiGatewayLambdaErrorResponseBody(error))
    }
  }

  convertIdToCode(performanceId: string): PerformanceCode {
    const performanceIdCodeMap = {
      'frozen': '3015',
      'the-hunchback-of-notre-dame': '3009',
      'beauty-and-the-beast': '2007',
      'beauty-and-the-beast-2': '3017',
    }
    return PerformanceCode.create(performanceIdCodeMap[performanceId])
  }

}