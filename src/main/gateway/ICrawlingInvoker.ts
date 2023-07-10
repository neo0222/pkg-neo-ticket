import { Session } from "../domain/model/session/Session";
import { PerformanceCode } from "../domain/value/performance/PerformanceCode";
import { PerformanceDatetimeInfo } from "../domain/value/performance/PerformanceDatetimeInfo";
import { PerformanceDatetimeInfoList } from "../domain/value/performance/PerformanceDatetimeInfoList";
import { VacantSeatInfoList } from "../domain/value/seat/VacantSeatInfoList";

export interface ICrawlingInvoker {
  getSession(): Promise<Session>
  getYearAndMonthList(session: Session, performanceCode: PerformanceCode, koenki: string): Promise<string[]>
  leadSessionForDateSelection(session: Session, yyyymm: string, performanceCode: PerformanceCode, koenki: string): Promise<any>
  getAvailabledatetimeList(session: Session, yyyymm: string, performanceCode: PerformanceCode, koenKi: string): Promise<PerformanceDatetimeInfoList>
  getAvailableSeatSvg(session: Session, yyyymm: string, availableDatetime: PerformanceDatetimeInfo): Promise<string>
  getAvailableSeatList(svgData: string, performanceCode: PerformanceCode): Promise<VacantSeatInfoList>
}