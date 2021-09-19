import { EntityBase } from "../domain/model/EntityBase";
import { IDto } from "./IDto";

export interface IDtoConverter<TDto extends IDto, TEntityBase extends EntityBase> {
  }

interface IDtoConverterConstructor<TDto extends IDto, TEntityBase extends EntityBase> {
  new (): IDtoConverter<TDto, TEntityBase>
  toDto(entity: TEntityBase): TDto
  toEntity(dto: TDto): TEntityBase
}