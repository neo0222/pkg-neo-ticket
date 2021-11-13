import moment from "moment"
import { BatchAssignCrawlingDetail } from "../../application/crawling/detail/BatchAssignCrawlingDetail"
import { EventBridgeLambdaEvent } from "../../application/event-bridge/EventBridgeLambdaEvent"
import { CrawlingResult } from "../../domain/model/crawling-result/CrawlingResult"
import { Session } from "../../domain/model/session/Session"
import { ICrawlingResultRepository } from "../../domain/repository/crawling-result/ICrawlingResultRepository"
import { PerformanceCode } from "../../domain/value/performance/PerformanceCode"
import { PerformanceDatetimeInfo } from "../../domain/value/performance/PerformanceDatetimeInfo"
import { PerformanceDatetimeInfoList } from "../../domain/value/performance/PerformanceDatetimeInfoList"
import { PerformanceId } from "../../domain/value/performance/PerformanceId"
import { PerformanceName } from "../../domain/value/performance/PerformanceName"
import { VacantSeatInfoList } from "../../domain/value/seat/VacantSeatInfoList"
import { ICrawlingInvoker } from "../../gateway/ICrawlingInvoker"
import { IS3Invoker } from "../../gateway/IS3Invoker"
import { IController } from "../IController"

export class CrawlVacantSeatController implements IController {

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

  async execute(event: EventBridgeLambdaEvent<BatchAssignCrawlingDetail>): Promise<any> {
    try {
      const { time } = event
      const { performanceCode, yyyymm, koenKi }: BatchAssignCrawlingDetail = event.detail
      const session: Session = await this.crawlingInvoker.getSession()
      const availableDatetimeList: PerformanceDatetimeInfoList = await this.crawlingInvoker.getAvailabledatetimeList(
        session,
        yyyymm,
        PerformanceCode.create(performanceCode),
        koenKi)
      const performanceDatetimeInfoAndRawCrawlingResultMap: Map<PerformanceDatetimeInfo, string> = new Map<PerformanceDatetimeInfo, string>()
      for (const availableDatetime of availableDatetimeList.list) {
        const vacantSeatSvg: string = await this.crawlingInvoker.getAvailableSeatSvg(session, yyyymm, availableDatetime)
        performanceDatetimeInfoAndRawCrawlingResultMap.set(
          availableDatetime,
          vacantSeatSvg
        )
      }
      const promises: Promise<void>[] = []
      for (const [availableDatetime, rawCrawlingResult] of performanceDatetimeInfoAndRawCrawlingResultMap.entries()) {
        promises.push((async () => {
          const vacantSeatInfoList: VacantSeatInfoList = await this.crawlingInvoker.getAvailableSeatList(rawCrawlingResult)
          const crawlingResult: CrawlingResult = new CrawlingResult(
            PerformanceId.create(performanceCode === '1011' ? 'the-phantom-of-the-opera' : 'aladdin'), // TODO: 演目マスタをDBにもつようにする
            PerformanceCode.create(performanceCode),
            PerformanceName.create(performanceCode === '1011' ? 'オペラ座の怪人' : 'アラジン'), // TODO: 演目マスタをDBにもつようにする
            availableDatetime.day,
            availableDatetime.matineeOrSoiree,
            availableDatetime.startTime,
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