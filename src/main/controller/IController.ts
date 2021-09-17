import { ILambdaEvent } from "../application/ILambdaEvent";
import { ILambdaResponse } from "../application/ILambdaResponse";

export interface IController {
 
  execute(event: ILambdaEvent): ILambdaResponse
}