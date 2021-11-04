import { IEventBridgeLambdaDetail } from "../../event-bridge/IEventBridgeLambdaDetail";

export class BatchAssignCrawlingDetail implements IEventBridgeLambdaDetail {
  performanceCode: string
  yyyymm: string
  koenKi: string

  constructor(
    _performanceCode: string,
    _yyyymm: string,
    _koenKi: string
  ) {
    this.performanceCode = _performanceCode
    this.yyyymm = _yyyymm
    this.koenKi = _koenKi
  }
}
