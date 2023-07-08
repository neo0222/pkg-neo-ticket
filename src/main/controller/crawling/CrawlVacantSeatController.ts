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
      const processAvailableDatetimeList = async (availableDatetimeList: PerformanceDatetimeInfoList) => {
        const newSession: Session = await this.crawlingInvoker.getSession()
        await this.crawlingInvoker.leadSessionForDateSelection(
          newSession,
          yyyymm,
          PerformanceCode.create(performanceCode),
          koenKi,
        )
        console.log(`start crawling process. perfomanceCode: ${performanceCode}, yyyymm: ${yyyymm}, target list: ${availableDatetimeList}`)
        for (const availableDatetime of availableDatetimeList.list) {
          const vacantSeatSvg: string = await this.crawlingInvoker.getAvailableSeatSvg(newSession, yyyymm, availableDatetime)
          performanceDatetimeInfoAndRawCrawlingResultMap.set(
            availableDatetime,
            vacantSeatSvg
          )
        }
      }
      const availableDatetimeListList: PerformanceDatetimeInfoList[] = availableDatetimeList.split()
      const crawlByDatePromises: Promise<void>[] = []
      for (const availableDatetimeList of availableDatetimeListList) {
        crawlByDatePromises.push(
          processAvailableDatetimeList(availableDatetimeList)
        )
      }
      await Promise.all(crawlByDatePromises)
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
      const promises: Promise<void>[] = []
      for (const [availableDatetime, rawCrawlingResult] of performanceDatetimeInfoAndRawCrawlingResultMap.entries()) {
        promises.push((async () => {
          const vacantSeatInfoList: VacantSeatInfoList = await this.crawlingInvoker.getAvailableSeatList(rawCrawlingResult, PerformanceCode.create(performanceCode))
          const crawlingResult: CrawlingResult = new CrawlingResult(
            PerformanceId.create(performanceCodeMap[performanceCode].performanceId), // TODO: 演目マスタをDBにもつようにする
            PerformanceCode.create(performanceCode),
            PerformanceName.create(performanceCodeMap[performanceCode].performanceName), // TODO: 演目マスタをDBにもつようにする
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