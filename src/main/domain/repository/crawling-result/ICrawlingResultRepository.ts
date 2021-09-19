
import { Optional } from "../../../common/Optional";
import { CrawlingResult } from "../../model/crawling-result/CrawlingResult";
import { MatineeOrSoiree } from "../../value/performance/MatineeOrSoiree";
import { PerformanceCode } from "../../value/performance/PerformanceCode";
import { PerformanceDate } from "../../value/performance/PerformanceDate";
import { IRepositoryBase } from "../IRepositoryBase";

export interface ICrawlingResultRepository extends IRepositoryBase<CrawlingResult> {
  save(crawlingResult: CrawlingResult): Promise<void>
  findByCodeAndDateAndMatineeOrSoiree(
    code: PerformanceCode,
    date: PerformanceDate,
    matineeOrSoiree: MatineeOrSoiree): Promise<Optional<CrawlingResult>>
}