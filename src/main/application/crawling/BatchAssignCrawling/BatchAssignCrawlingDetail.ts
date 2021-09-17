import { IEventBridgeLambdaDetail } from "../../event-bridge/IEventBridgeLambdaDetail";

export class BatchAssignCrawlingDetail implements IEventBridgeLambdaDetail {
  performanceCode: string
  yyyymm: string

  constructor(
    _performanceCode: string,
    _yyyymm: string
  ) {
    this.performanceCode = _performanceCode
    this.yyyymm = _yyyymm
  }
}
