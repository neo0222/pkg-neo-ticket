import { Session } from "../domain/model/session/Session";

export interface ICrawlingInvoker {
  getSession(): Promise<Session>
  getYearAndMonthList(session: Session): Promise<string[]>
  getAvailabledatetimeList(): Promise<void>
  getAvailableSeatList(): Promise<void>
}