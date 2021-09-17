import { EntityBase } from "../EntityBase";

export class Session extends EntityBase {
  skSession: string
  bigIpKeyValueJoinWithEqual: string
  headersForPost: object
  headersForHtml: object
}