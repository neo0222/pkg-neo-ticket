import { DetailType } from '../../application/event-bridge/DetailType';
import { EventBridgeLambdaEvent } from "../../application/event-bridge/EventBridgeLambdaEvent";
import { BatchAssignCrawlingDetail } from "../../application/crawling/BatchAssignCrawling/BatchAssignCrawlingDetail";
import { Session } from '../../domain/model/session/Session';
import { ICrawlingInvoker } from '../../gateway/ICrawlingInvoker';
import { IEventBridgeInvoker } from '../../gateway/IEventBridgeInvoker';
import { IController } from "../IController";

export class BatchAssignCrawlingController implements IController {

  crawlingInvoker: ICrawlingInvoker
  eventBridgeInvoker: IEventBridgeInvoker

  constructor(
    crawlingInvoker: ICrawlingInvoker,
    eventBridgeInvoker: IEventBridgeInvoker
  ) {
    this.crawlingInvoker = crawlingInvoker
    this.eventBridgeInvoker = eventBridgeInvoker
  }

  async execute(event: EventBridgeLambdaEvent<BatchAssignCrawlingDetail>): Promise<any> {
    try {
      const session: Session = await this.crawlingInvoker.getSession()
      const yearAndMonthList: string[] = await this.crawlingInvoker.getYearAndMonthList(session)
      const promises = []
      for (const yyyymm of yearAndMonthList) {
        promises.push(this.eventBridgeInvoker.putEvents(
          DetailType.AssignCrawling,
          new BatchAssignCrawlingDetail(
            '1011', // TODO: 複数公演に対応させる
            yyyymm
          )
        ))
      }
      await Promise.all(promises)
    } catch (error) {
      console.error(error)
    }
  }
}