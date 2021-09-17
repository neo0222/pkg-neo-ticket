import { IController } from "../controller/IController"
import { ILambdaEvent } from "./ILambdaEvent"
import { ILambdaResponse } from "./ILambdaResponse"

export class LambdaFunction<T extends ILambdaEvent, S extends ILambdaResponse> {
  controller: IController

  constructor(controller: IController) {
    this.controller = controller
  }

  handler(event, context) {
    if (event.warmup) {
      console.log('this is warmup.')
      return 
    }
    console.log(JSON.stringify(event))
    return this.controller.execute(event as T)
  }

}
