import { DynamoDBStreamEvent } from "aws-lambda"
import { BusinessError } from "../../common/BusinessError"
import { CrawlingResult } from "../../domain/model/crawling-result/CrawlingResult"
import { Seat } from "../../domain/model/seat/Seat"
import { Session } from "../../domain/model/session/Session"
import { ICrawlingResultRepository } from "../../domain/repository/crawling-result/ICrawlingResultRepository"
import { ISeatRepository } from "../../domain/repository/seat/ISeatRepository"
import { ISessionRepository } from "../../domain/repository/session/ISessionRepository"
import { MatineeOrSoiree } from "../../domain/value/performance/MatineeOrSoiree"
import { PerformanceCode } from "../../domain/value/performance/PerformanceCode"
import { PerformanceDate } from "../../domain/value/performance/PerformanceDate"
import { DetectionDatetime } from "../../domain/value/seat/DetectionDatetime"
import { ICrawlingInvoker } from "../../gateway/ICrawlingInvoker"
import { IController } from "../IController"

export class GrowUpSessionController implements IController {

  sessionRepository: ISessionRepository
  crawlingInvoker:ICrawlingInvoker

  constructor(
    sessionRepository: ISessionRepository,
    crawlingInvoker:ICrawlingInvoker,
  ) {
    this.sessionRepository = sessionRepository
    this.crawlingInvoker = crawlingInvoker
  }

  async execute(event: DynamoDBStreamEvent): Promise<any> {
    try {
      const promises: Promise<void>[] = []
      for (const record of event.Records) {
        if (record.eventName === 'REMOVE' || record.eventName === 'MODIFY') continue
        promises.push((async () => {
          if (record.dynamodb?.NewImage?.skSession?.S === undefined) throw BusinessError.REQUIRED_PARAMETER_NOT_GIVEN
          const session: Session = (await this.sessionRepository.findBySkSession(record.dynamodb?.NewImage?.skSession?.S))
            .orElseThrow(BusinessError.SESSION_NOT_FOUND)
          
          await this.crawlingInvoker.leadSessionForDateSelection(
            session,
            session.sessionGoal?.yyyymm!,
            session.sessionGoal?.performanceCode!,
            session.sessionGoal?.koenki!
          )

          session.ready()

          await this.sessionRepository.save(session)
        })())
      }
      await Promise.all(promises)
    } catch (error) {
      console.log(error)
    }
  }

}