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
    const performanceCodeMap = {
      '3015': {
        performanceId: 'frozen',
        performanceName: 'アナと雪の女王',
      },
      '3009': {
        performanceId: 'the-hunchback-of-notre-dame',
        performanceName: 'ノートルダムの鐘',
      },
      '2007': {
        performanceId: 'beauty-and-the-beast',
        performanceName: '美女と野獣',
      },
      '3017': {
        performanceId: 'beauty-and-the-beast-2',
        performanceName: '美女と野獣',
      },
    }
    try {
      const promises: Promise<void>[] = []
      for (const record of event.Records) {
        promises.push((async () => {
          const objectKey: string = record.s3.object.key
          const body: Nullable<string> = await this.s3Invoker.getObject(objectKey)
          if (!body) throw SystemError.S3_ACCESS_FAILED
          const [ , performanceCode, performanceDate, matineeOrSoiree, startTimeWithoutColon, fileName ]: [ string, string, string, MatineeOrSoiree, string, string ] = objectKey.split('/') as [ string, string, string, MatineeOrSoiree, string, string ]
          const vacantSeatInfoList: VacantSeatInfoList = await this.crawlingInvoker.getAvailableSeatList(body, PerformanceCode.create(performanceCode))
          const crawlingResult: CrawlingResult = new CrawlingResult(
            PerformanceId.create(performanceCodeMap[performanceCode].performanceId), // TODO: 演目マスタをDBにもつようにする
            PerformanceCode.create(performanceCode),
            PerformanceName.create(performanceCodeMap[performanceCode].performanceName), // TODO: 演目マスタをDBにもつようにする
            PerformanceDate.create(performanceDate),
            matineeOrSoiree,
            PerformanceStartTime.fromHHmm(startTimeWithoutColon),
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