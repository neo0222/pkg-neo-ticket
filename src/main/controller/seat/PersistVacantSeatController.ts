import { DynamoDBStreamEvent } from "aws-lambda"
import { BatchAssignCrawlingDetail } from "../../application/crawling/detail/BatchAssignCrawlingDetail"
import { EventBridgeLambdaEvent } from "../../application/event-bridge/EventBridgeLambdaEvent"
import { BusinessError } from "../../common/BusinessError"
import { Nullable } from "../../common/Nullable"
import { SystemError } from "../../common/SystemError"
import { CrawlingResult } from "../../domain/model/crawling-result/CrawlingResult"
import { Seat } from "../../domain/model/seat/Seat"
import { Session } from "../../domain/model/session/Session"
import { ICrawlingResultRepository } from "../../domain/repository/crawling-result/ICrawlingResultRepository"
import { ISeatRepository } from "../../domain/repository/seat/ISeatRepository"
import { MatineeOrSoiree } from "../../domain/value/performance/MatineeOrSoiree"
import { PerformanceCode } from "../../domain/value/performance/PerformanceCode"
import { PerformanceDate } from "../../domain/value/performance/PerformanceDate"
import { PerformanceDatetimeInfoList } from "../../domain/value/performance/PerformanceDatetimeInfoList"
import { PerformanceId } from "../../domain/value/performance/PerformanceId"
import { PerformanceName } from "../../domain/value/performance/PerformanceName"
import { DetectionDatetime } from "../../domain/value/seat/DetectionDatetime"
import { VacantSeatInfoList } from "../../domain/value/seat/VacantSeatInfoList"
import { ICrawlingInvoker } from "../../gateway/ICrawlingInvoker"
import { IS3Invoker } from "../../gateway/IS3Invoker"
import { ISnsInvoker } from "../../gateway/ISnsInvoker"
import { IController } from "../IController"

export class PersistVacantSeatController implements IController {

  crawlingResultRepository: ICrawlingResultRepository
  seatRepository: ISeatRepository
  snsInvoker: ISnsInvoker

  constructor(
    crawlingResultRepository: ICrawlingResultRepository,
    seatRepository: ISeatRepository,
    snsInvoker: ISnsInvoker,
  ) {
    this.crawlingResultRepository = crawlingResultRepository
    this.seatRepository = seatRepository
    this.snsInvoker = snsInvoker
  }

  async execute(event: DynamoDBStreamEvent): Promise<any> {
    try {
      const promises: Promise<void>[] = []
      for (const record of event.Records) {
        if (record.eventName === 'REMOVE') continue
        promises.push((async () => {
          if (record.dynamodb?.NewImage?.performanceCode?.S === undefined) throw BusinessError.PERFORMANCE_CODE_NOT_GIVEN
          if (record.dynamodb?.NewImage?.performanceDate?.S === undefined) throw BusinessError.PERFORMANCE_DATE_NOT_GIVEN
          if (record.dynamodb?.NewImage?.matineeOrSoiree?.S === undefined) throw BusinessError.MATINEE_OR_SOIREE_NOT_GIVEN
          if (record.dynamodb?.ApproximateCreationDateTime === undefined) throw BusinessError.INVALID_DATE_FORMAT
          const unixTime: number = record.dynamodb?.ApproximateCreationDateTime
          const crawlingResult: CrawlingResult = (await this.crawlingResultRepository.findByCodeAndDateAndMatineeOrSoiree(
            PerformanceCode.create(record.dynamodb.NewImage['performanceCode'].S),
            PerformanceDate.create(record.dynamodb.NewImage['performanceDate'].S),
            record.dynamodb.NewImage['matineeOrSoiree'].S as MatineeOrSoiree
          )).orElseThrow(BusinessError.CRAWLER_RESULT_NOT_FOUND)
          // すでに空席として登録されている全量を取得
          const alreadyVacantSeatList: Seat[] = (await this.seatRepository.findByCodeAndDateAndMatineeOrSoiree(
            PerformanceCode.create(record.dynamodb.NewImage['performanceCode'].S),
            PerformanceDate.create(record.dynamodb.NewImage['performanceDate'].S),
            record.dynamodb.NewImage['matineeOrSoiree'].S as MatineeOrSoiree
          )).get()
          const seatPromises: Promise<void>[] = []
          for (const vacantSeatInfo of crawlingResult.vacantSeatInfoList.list) {
            seatPromises.push((async () => {
              // すでに空席であれば永続化しない
              if (alreadyVacantSeatList.some(alreadyVacantSeat => {
                return vacantSeatInfo.equals(alreadyVacantSeat.seatInfo)
              })) {
                return
              }
              // 以降、満席として登録されていたが今回空席となっていた座席の永続化処理
              const seat: Seat = Seat.create(
                crawlingResult.performanceId,
                crawlingResult.performanceCode,
                crawlingResult.performanceName,
                crawlingResult.performanceDate,
                crawlingResult.matineeOrSoiree,
                crawlingResult.performanceStartTime,
                vacantSeatInfo,
                DetectionDatetime.fromUnixTime(unixTime)
              )
              await this.seatRepository.save(seat)
              // 通知
              await this.snsInvoker.publish(seat.notificationSubject, seat.notificationMessage)
            })())
          }
          await Promise.all(seatPromises)
        })())
      }
      await Promise.all(promises)
    } catch (error) {
      console.log(error)
    }
  }

}