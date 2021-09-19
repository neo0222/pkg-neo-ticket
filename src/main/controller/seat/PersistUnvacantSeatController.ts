import { DynamoDBStreamEvent } from "aws-lambda"
import { BusinessError } from "../../common/BusinessError"
import { CrawlingResult } from "../../domain/model/crawling-result/CrawlingResult"
import { Seat } from "../../domain/model/seat/Seat"
import { ICrawlingResultRepository } from "../../domain/repository/crawling-result/ICrawlingResultRepository"
import { ISeatRepository } from "../../domain/repository/seat/ISeatRepository"
import { MatineeOrSoiree } from "../../domain/value/performance/MatineeOrSoiree"
import { PerformanceCode } from "../../domain/value/performance/PerformanceCode"
import { PerformanceDate } from "../../domain/value/performance/PerformanceDate"
import { DetectionDatetime } from "../../domain/value/seat/DetectionDatetime"
import { IController } from "../IController"

export class PersistUnvacantSeatController implements IController {

  crawlingResultRepository: ICrawlingResultRepository
  vacantSeatRepository: ISeatRepository
  unvacantSeatRepository: ISeatRepository

  constructor(
    crawlingResultRepository: ICrawlingResultRepository,
    vacantSeatRepository: ISeatRepository,
    unvacantSeatRepository: ISeatRepository
  ) {
    this.crawlingResultRepository = crawlingResultRepository
    this.vacantSeatRepository = vacantSeatRepository
    this.unvacantSeatRepository = unvacantSeatRepository
  }

  async execute(event: DynamoDBStreamEvent): Promise<any> {
    try {
      const promises: Promise<void>[] = []
      for (const record of event.Records) {
        if (record.eventName === 'REMOVE') continue // 削除はあり得ない。新規も本来あり得ないが、過去にRESULTが保存されていなかった場合には必要
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
          const maybeVacantSeatList: Seat[] = (await this.vacantSeatRepository.findByCodeAndDateAndMatineeOrSoiree(
            PerformanceCode.create(record.dynamodb.NewImage['performanceCode'].S),
            PerformanceDate.create(record.dynamodb.NewImage['performanceDate'].S),
            record.dynamodb.NewImage['matineeOrSoiree'].S as MatineeOrSoiree
          )).get()
          const seatPromises: Promise<void>[] = []
          for (const maybeVacantSeat of maybeVacantSeatList) {
            seatPromises.push((async () => {
              if (crawlingResult.vacantSeatInfoList.includes(maybeVacantSeat)) return
              maybeVacantSeat.makeUnvacant(DetectionDatetime.fromUnixTime(unixTime))
              await this.unvacantSeatRepository.save(maybeVacantSeat)
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