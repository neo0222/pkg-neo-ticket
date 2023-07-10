import moment from "moment"
import { BatchAssignCrawlingDetail } from "../../application/crawling/detail/BatchAssignCrawlingDetail"
import { EventBridgeLambdaEvent } from "../../application/event-bridge/EventBridgeLambdaEvent"
import { BusinessError } from "../../common/BusinessError"
import { CrawlingResult } from "../../domain/model/crawling-result/CrawlingResult"
import { Session } from "../../domain/model/session/Session"
import { ICrawlingResultRepository } from "../../domain/repository/crawling-result/ICrawlingResultRepository"
import { ISessionRepository } from "../../domain/repository/session/ISessionRepository"
import { PerformanceCode } from "../../domain/value/performance/PerformanceCode"
import { PerformanceDatetimeInfo } from "../../domain/value/performance/PerformanceDatetimeInfo"
import { PerformanceDatetimeInfoList } from "../../domain/value/performance/PerformanceDatetimeInfoList"
import { PerformanceId } from "../../domain/value/performance/PerformanceId"
import { PerformanceName } from "../../domain/value/performance/PerformanceName"
import { VacantSeatInfoList } from "../../domain/value/seat/VacantSeatInfoList"
import { SessionGoal } from "../../domain/value/session/SessionGoal"
import { ICrawlingInvoker } from "../../gateway/ICrawlingInvoker"
import { IS3Invoker } from "../../gateway/IS3Invoker"
import { CommonUtil } from "../../util/CommonUtil"
import { IController } from "../IController"

export class CrawlVacantSeatController implements IController {

  crawlingInvoker: ICrawlingInvoker
  s3Invoker: IS3Invoker
  crawlingResultRepository: ICrawlingResultRepository
  sessionRepository: ISessionRepository

  constructor(
    crawlingInvoker: ICrawlingInvoker,
    s3Invoker: IS3Invoker,
    crawlingResultRepository: ICrawlingResultRepository,
    sessionRepository: ISessionRepository,
  ) {
    this.crawlingInvoker = crawlingInvoker
    this.s3Invoker = s3Invoker
    this.crawlingResultRepository = crawlingResultRepository
    this.sessionRepository = sessionRepository
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
        console.log(`[SUCCESS]got new srssion. session: ${JSON.stringify(newSession)}`)
        newSession.setGoal(
          SessionGoal.create({
            yyyymm: yyyymm,
            performanceCode: performanceCode,
            koenki: koenKi
          })
        )
        await this.waitUntilSessionIsReady(newSession)
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
      console.log(`performanceDatetimeInfoAndRawCrawlingResultMap.size: ${performanceDatetimeInfoAndRawCrawlingResultMap.size}`)
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
          await this.crawlingResultRepository.save(crawlingResult)
        })())
      }
      await Promise.all(promises)
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async waitUntilSessionIsReady(session: Session): Promise<void> {
    await this.sessionRepository.save(session)
    let retryCount = 0
    const initialIntervalSecond: number = 0.3
    let intervalSecond: number = initialIntervalSecond
    while (true) {
      const maybeReadySession: Session = (await this.sessionRepository.findBySkSession(session.skSession))
        .orElseThrow(
          BusinessError.SESSION_NOT_FOUND,
        )
      if (maybeReadySession.isReady) {
        console.log(`[SUCCESS]session ${session.skSession} is ready. retryCount: ${retryCount}`)
        await this.sessionRepository.deleteBySkSession(session.skSession)
        console.log(`[SUCCESS]ready session ${session.skSession} is successfully deleted.`)
        return
      }
      console.log(`[INFO]session ${session.skSession} is NOT ready. Going to retry in ${intervalSecond} sec... (retryCount: ${retryCount}) session: ${JSON.stringify(maybeReadySession)}`)
      await CommonUtil.sleep(intervalSecond)
      intervalSecond = intervalSecond * 2
      retryCount++
      if (retryCount > 5) {
        console.log(`[WARN]session wait retry count: ${retryCount}, session: ${session.skSession}`)
      }
    }
  }

}