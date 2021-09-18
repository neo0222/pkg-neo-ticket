import { BatchAssignCrawlingDetail } from "../../application/crawling/detail/BatchAssignCrawlingDetail"
import { EventBridgeLambdaEvent } from "../../application/event-bridge/EventBridgeLambdaEvent"
import { CrawlingResult } from "../../domain/model/crawling-result/CrawlingResult"
import { Session } from "../../domain/model/session/Session"
import { ICrawlingResultRepository } from "../../domain/repository/crawling-result/ICrawlingResultRepository"
import { PerformanceCode } from "../../domain/value/performance/PerformanceCode"
import { PerformanceDatetimeInfoList } from "../../domain/value/performance/PerformanceDatetimeInfoList"
import { PerformanceId } from "../../domain/value/performance/PerformanceId"
import { PerformanceName } from "../../domain/value/performance/PerformanceName"
import { VacantSeatInfoList } from "../../domain/value/seat/VacantSeatInfoList"
import { ICrawlingInvoker } from "../../gateway/ICrawlingInvoker"
import { IController } from "../IController"

export class CrawlVacantSeatController implements IController {

  crawlingInvoker: ICrawlingInvoker
  crawlingResultRepository: ICrawlingResultRepository

  constructor(
    crawlingInvoker: ICrawlingInvoker,
    crawlingResultRepository: ICrawlingResultRepository
  ) {
    this.crawlingInvoker = crawlingInvoker
    this.crawlingResultRepository = crawlingResultRepository
  }

  async execute(event: EventBridgeLambdaEvent<BatchAssignCrawlingDetail>): Promise<any> {
    try {
      const { performanceCode, yyyymm }: BatchAssignCrawlingDetail = event.detail
      const session: Session = await this.crawlingInvoker.getSession()
      const availableDatetimeList: PerformanceDatetimeInfoList = await this.crawlingInvoker.getAvailabledatetimeList(session, yyyymm)
      for (const availableDatetime of availableDatetimeList.list) {
        const vacantSeatList: VacantSeatInfoList = await this.crawlingInvoker.getAvailableSeatList(session, yyyymm, availableDatetime)
        const crawlingResult: CrawlingResult = new CrawlingResult(
          PerformanceId.create('the-phantom-of-the-opera'), // TODO: 複数演目に対応できるようにする
          PerformanceCode.create(performanceCode),
          PerformanceName.create('オペラ座の怪人'), // TODO: 複数演目に対応できるようにする
          availableDatetime.day,
          availableDatetime.matineeOrSoiree,
          vacantSeatList
        )
        await this.crawlingResultRepository.save(crawlingResult)
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  }

}