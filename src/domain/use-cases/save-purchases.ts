import {type} from "os";

export interface SavePurchases{
  save: (data:Array<SavePurchases.Params>) => Promise<void>
}

export namespace SavePurchases{
  export type Params = {
    id:string
    value:number,
    date:Date
  }
}
