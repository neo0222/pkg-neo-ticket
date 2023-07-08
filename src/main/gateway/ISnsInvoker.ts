export interface ISnsInvoker {
  publish(subject: string, message: string): Promise<void>
}