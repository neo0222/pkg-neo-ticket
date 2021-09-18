
export interface IS3Invoker {
  putObject(obejctKey: string, body: string): Promise<void>
}