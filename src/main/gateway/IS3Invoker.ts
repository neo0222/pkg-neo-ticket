import { Nullable } from "../common/Nullable";

export interface IS3Invoker {
  putObject(obejctKey: string, body: string): Promise<void>
  getObject(objectKey: string): Promise<Nullable<string>>
}