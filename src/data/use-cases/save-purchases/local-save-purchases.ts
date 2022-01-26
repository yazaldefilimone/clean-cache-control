import { CacheStorage } from "@/data/protocols/cache"

import { SavePurchases } from "@/domain/use-cases"

export class LocalSavePurchases implements SavePurchases{
  constructor(private readonly  cacheStorage:CacheStorage){} 

  async save(data:Array<SavePurchases.Params>): Promise<void>{
    this.cacheStorage.delete('purchases');
    this.cacheStorage.insert('purchases', data)
  }
}
