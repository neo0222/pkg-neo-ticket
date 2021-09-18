import moment from "moment"
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
import { IS3Invoker } from "../../gateway/IS3Invoker"
import { IController } from "../IController"

export class CrawlVacantSeatController implements IController {

  crawlingInvoker: ICrawlingInvoker
  s3Invoker: IS3Invoker

  constructor(
    crawlingInvoker: ICrawlingInvoker,
    s3Invoker: IS3Invoker
  ) {
    this.crawlingInvoker = crawlingInvoker
    this.s3Invoker = s3Invoker
  }

  async execute(event: EventBridgeLambdaEvent<BatchAssignCrawlingDetail>): Promise<any> {
    try {
      const { time } = event
      const { performanceCode, yyyymm }: BatchAssignCrawlingDetail = event.detail
      const session: Session = await this.crawlingInvoker.getSession()
      const availableDatetimeList: PerformanceDatetimeInfoList = await this.crawlingInvoker.getAvailabledatetimeList(session, yyyymm)
      for (const availableDatetime of availableDatetimeList.list) {
        const vacantSeatSvg: string = await this.crawlingInvoker.getAvailableSeatSvg(session, yyyymm, availableDatetime)
        await this.s3Invoker.putObject(
          `shiki/${performanceCode}/${availableDatetime.day}/${availableDatetime.matineeOrSoiree}/${moment(time, 'YYYY-MM-DDTHH:mm:ssZ').format('YYYYMMDDHHmmss')}.txt`,
          vacantSeatSvg
        )
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  }

}