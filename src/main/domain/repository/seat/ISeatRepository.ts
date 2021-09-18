import { Optional } from "../../../common/Optional";
import { Seat } from "../../model/seat/Seat";
import { MatineeOrSoiree } from "../../value/performance/MatineeOrSoiree";
import { PerformanceCode } from "../../value/performance/PerformanceCode";
import { PerformanceDate } from "../../value/performance/PerformanceDate";
import { IsVacant } from "../../value/seat/IsVacant";
import { IRepositoryBase } from "../IRepositoryBase";

export interface ISeatRepository extends IRepositoryBase<Seat> {
  save(seat: Seat): Promise<void>
  findByCodeAndDateAndMatineeOrSoiree(
    code: PerformanceCode,
    date: PerformanceDate,
    matineeOrSoiree: MatineeOrSoiree
  ): Promise<Optional<Seat[]>>
}