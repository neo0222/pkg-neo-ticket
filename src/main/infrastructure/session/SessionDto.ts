import { IDto } from "../IDto";

export class SessionDto implements IDto {
  pk: string
  skSession: string
  bigIpKeyValueJoinWithEqual: string
  headersForPost: object
  headersForHtml: object
  isReady?: string
  performanceCode: string
  koenki: string
  yyyymm?: string

  constructor(
    _pk: string,
    _skSession: string,
    _bigIpKeyValueJoinWithEqual: string,
    _headersForPost: object,
    _headersForHtml: object,
    _isReady: string | undefined,
    _performanceCode: string,
    _koenki: string,
    _yyyymm?: string,
  ) {
    this.pk = _pk
    this.skSession = _skSession
    this.bigIpKeyValueJoinWithEqual = _bigIpKeyValueJoinWithEqual
    this.headersForPost = _headersForPost
    this.headersForHtml = _headersForHtml
    this.isReady = _isReady
    this.performanceCode = _performanceCode
    this.koenki = _koenki
    this.yyyymm = _yyyymm
  }
}