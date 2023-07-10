
import { Optional } from "../../../common/Optional";
import { CrawlingResult } from "../../model/crawling-result/CrawlingResult";
import { Session } from "../../model/session/Session";
import { MatineeOrSoiree } from "../../value/performance/MatineeOrSoiree";
import { PerformanceCode } from "../../value/performance/PerformanceCode";
import { PerformanceDate } from "../../value/performance/PerformanceDate";
import { IRepositoryBase } from "../IRepositoryBase";

export interface ISessionRepository extends IRepositoryBase<Session> {
  save(session: Session): Promise<void>
  findBySkSession(
    skSession: string,
  ): Promise<Optional<Session>>
}