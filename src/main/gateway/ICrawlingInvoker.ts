import { Session } from "../domain/model/session/Session";
import { PerformanceDatetimeInfo } from "../domain/value/performance/PerformanceDatetimeInfo";
import { PerformanceDatetimeInfoList } from "../domain/value/performance/PerformanceDatetimeInfoList";
import { VacantSeatInfoList } from "../domain/value/seat/VacantSeatInfoList";

export interface ICrawlingInvoker {
  getSession(): Promise<Session>
  getYearAndMonthList(session: Session): Promise<string[]>
  getAvailabledatetimeList(session: Session, yyyymm: string): Promise<PerformanceDatetimeInfoList>
  getAvailableSeatSvg(session: Session, yyyymm: string, availableDatetime: PerformanceDatetimeInfo): Promise<string>
  getAvailableSeatList(svgData: string): Promise<VacantSeatInfoList>
}