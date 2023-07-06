import { DetailType } from '../../application/event-bridge/DetailType';
import { EventBridgeLambdaEvent } from "../../application/event-bridge/EventBridgeLambdaEvent";
import { BatchAssignCrawlingDetail } from "../../application/crawling/detail/BatchAssignCrawlingDetail";
import { Session } from '../../domain/model/session/Session';
import { ICrawlingInvoker } from '../../gateway/ICrawlingInvoker';
import { IEventBridgeInvoker } from '../../gateway/IEventBridgeInvoker';
import { IController } from "../IController";
import { PerformanceCode } from '../../domain/value/performance/PerformanceCode';

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
      const items: {performanceCode: PerformanceCode, koenKi: string}[] = [
        // {
        //   performanceCode: PerformanceCode.create('1011'),
        //   koenKi: '6',
        // },
        // {
        //   performanceCode: PerformanceCode.create('1013'),
        //   koenKi: '14',
        // },
        {
          performanceCode: PerformanceCode.create('3015'),
          koenKi: '5',
          // アナ雪 2023/7-2023/12
          // onclick="dayClick('ry101001Form','3015','00',5,'0');"
        },
        {
          performanceCode: PerformanceCode.create('3009'),
          koenKi: '1',
          // ノートルダム
          // dayClick('ry101001Form','3009','00',1,'0');
        },
        {
          performanceCode: PerformanceCode.create('2007'),
          koenKi: '2',
          // 美女と野獣
          // dayClick('ry101001Form','2007','00',2,'0');
        },
        {
          performanceCode: PerformanceCode.create('3017'),
          koenKi: '3',
          // 美女と野獣
          // dayClick('ry101001Form','3017','00',3,'0');
        },
      ]
      for (const item of items) {
        const session: Session = await this.crawlingInvoker.getSession()
        const yearAndMonthList: string[] = await this.crawlingInvoker.getYearAndMonthList(session, item.performanceCode, item.koenKi)
        const promises: Promise<void>[] = []
        for (const yyyymm of yearAndMonthList) {
          promises.push(this.eventBridgeInvoker.putEvents(
            DetailType.AssignCrawling,
            new BatchAssignCrawlingDetail(
              item.performanceCode.toString(), // TODO: 複数公演に対応させる
              yyyymm,
              item.koenKi
            )
          ))
        }
        await Promise.all(promises)
      }
      
    } catch (error) {
      console.error(error)
    }
  }
}