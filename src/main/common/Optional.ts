import { BusinessError } from "./BusinessError"
import { Nullable } from "./Nullable"
import { SystemError } from "./SystemError"

export class Optional<T> {
  item: T
  
  constructor(item: T | undefined) {
    if (item !== undefined) this.item = item
  }

  static ofNullable(item: any): Optional<typeof item> {
    return new Optional<typeof item>(item)
  }

  isPresent(): boolean {
    return this.item != undefined
  }

  get(): T {
    if (this.item) return this.item
    throw BusinessError.NO_SUCH_ELEMENT_EXISTS
  }

  orElseThrow(error: BusinessError | SystemError): T {
    if (this.item) return this.item
    throw error
  }

  getOrEmpty(): Nullable<T> {
    if (this.item) return this.item
    return undefined
  }

  static empty() {
    return new Optional<undefined>(undefined)
  }
}