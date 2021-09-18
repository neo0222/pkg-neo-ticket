
import { CrawlingResult } from "../../model/crawling-result/CrawlingResult";
import { IRepositoryBase } from "../IRepositoryBase";

export interface ICrawlingResultRepository extends IRepositoryBase<CrawlingResult> {
  save(crawlingResult: CrawlingResult): Promise<void>
}