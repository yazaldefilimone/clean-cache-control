import { CacheStorage } from "@/data/protocols/cache"

export class LocalSavePurchases{
  constructor(private readonly  cacheStorage:CacheStorage){} 

  async save(): Promise<void>{
    this.cacheStorage.delete('purchases');
    this.cacheStorage.insert('purchases')
  }
}
