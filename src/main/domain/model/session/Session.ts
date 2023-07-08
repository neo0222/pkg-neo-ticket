import { SessionGoal } from "../../value/session/SessionGoal";
import { EntityBase } from "../EntityBase";

export class Session extends EntityBase {
  skSession: string
  bigIpKeyValueJoinWithEqual: string
  headersForPost: object
  headersForHtml: object
  isReady?: string
  sessionGoal?: SessionGoal

  constructor(
    _skSession: string,
    _bigIpKeyValueJoinWithEqual: string,
    _headersForPost: object,
    _headersForHtml: object,
    _isReady?: string,
    _sessionGoal?: SessionGoal,
  ) {
    super()
    this.skSession = _skSession
    this.bigIpKeyValueJoinWithEqual = _bigIpKeyValueJoinWithEqual
    this.headersForPost = _headersForPost
    this.headersForHtml = _headersForHtml
    this.isReady = _isReady
    this.sessionGoal = _sessionGoal
  }

  ready() {
    this.isReady = 'true'
  }

  setGoal(sessionGoal: SessionGoal) {
    this.sessionGoal = sessionGoal
  }
}