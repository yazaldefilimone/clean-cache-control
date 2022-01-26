import {type} from "os";

export interface SavePurchases{
  save: (data:SavePurchases.Purchases) => Promise<void>
}

namespace SavePurchases{
  export type Params = {
    id:string
    name:string,
    date:Date
  }
}
