import { S3Event } from "aws-lambda"
import { BatchAssignCrawlingDetail } from "../../application/crawling/detail/BatchAssignCrawlingDetail"
import { EventBridgeLambdaEvent } from "../../application/event-bridge/EventBridgeLambdaEvent"
import { Nullable } from "../../common/Nullable"
import { SystemError } from "../../common/SystemError"
import { CrawlingResult } from "../../domain/model/crawling-result/CrawlingResult"
import { Session } from "../../domain/model/session/Session"
import { ICrawlingResultRepository } from "../../domain/repository/crawling-result/ICrawlingResultRepository"
import { CrawlingDatetime } from "../../domain/value/crawling/CrawlingDatetime"
import { MatineeOrSoiree } from "../../domain/value/performance/MatineeOrSoiree"
import { PerformanceCode } from "../../domain/value/performance/PerformanceCode"
import { PerformanceDate } from "../../domain/value/performance/PerformanceDate"
import { PerformanceDatetimeInfoList } from "../../domain/value/performance/PerformanceDatetimeInfoList"
import { PerformanceId } from "../../domain/value/performance/PerformanceId"
import { PerformanceName } from "../../domain/value/performance/PerformanceName"
import { PerformanceStartTime } from "../../domain/value/performance/PerformanceStartTime"
import { VacantSeatInfoList } from "../../domain/value/seat/VacantSeatInfoList"
import { ICrawlingInvoker } from "../../gateway/ICrawlingInvoker"
import { IS3Invoker } from "../../gateway/IS3Invoker"
import { IController } from "../IController"

export class PersistCrawlingResultController implements IController {

  crawlingInvoker: ICrawlingInvoker
  s3Invoker: IS3Invoker
  crawlingResultRepository: ICrawlingResultRepository

  constructor(
    crawlingInvoker: ICrawlingInvoker,
    s3Invoker: IS3Invoker,
    crawlingResultRepository: ICrawlingResultRepository
  ) {
    this.crawlingInvoker = crawlingInvoker
    this.s3Invoker = s3Invoker
    this.crawlingResultRepository = crawlingResultRepository
  }

  async execute(event: S3Event): Promise<any> {
    try {
      const promises: Promise<void>[] = []
      for (const record of event.Records) {
        promises.push((async () => {
          const objectKey: string = record.s3.object.key
          const body: Nullable<string> = await this.s3Invoker.getObject(objectKey)
          if (!body) throw SystemError.S3_ACCESS_FAILED
          const vacantSeatInfoList: VacantSeatInfoList = await this.crawlingInvoker.getAvailableSeatList(body)
          const [ , performanceCode, performanceDate, matineeOrSoiree, startTime, fileName ]: [ string, string, string, MatineeOrSoiree, string, string ] = objectKey.split('/') as [ string, string, string, MatineeOrSoiree, string, string ]
          const crawlingResult: CrawlingResult = new CrawlingResult(
            PerformanceId.create('the-phantom-of-the-opera'), // TODO: 複数演目に対応できるようにする
            PerformanceCode.create(performanceCode),
            PerformanceName.create('オペラ座の怪人'), // TODO: 複数演目に対応できるようにする
            PerformanceDate.create(performanceDate),
            matineeOrSoiree,
            PerformanceStartTime.create(startTime),
            vacantSeatInfoList
          )
          this.crawlingResultRepository.save(crawlingResult)
        })())
      }
      await Promise.all(promises)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

}