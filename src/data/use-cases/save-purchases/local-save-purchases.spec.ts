import { LocalSavePurchases } from "@/data/use-cases";
import { CacheStorage } from "@/data/protocols/cache";

class CacheStorageSpy implements CacheStorage{
  deleteCallsCount = 0;
  key:srting

  async delete(key:string):void{
    this.deleteCallsCount++;
    this.key = key
  }
}

type SutTypes = {
  cacheStorage:CacheStorage;
  sut: LocalSavePurchases
}
const makeSut = () :SutTypes => {
  const cacheStorage = new CacheStorageSpy();
  const sut = new LocalSavePurchases(cacheStorage);
 
  return {
    sut,
    cacheStorage
  }
}

describe("LocalSavePurchases", () => {
  it('should not delete cache when call sut.init', () => {
    const { cacheStorage } = makeSut();
    expect(cacheStorage.deleteCallsCount).toBe(0);
  }) 

  it('should delete old cache when call sut.save', async () => {
    const { cacheStorage, sut } = makeSut();
    await sut.save();
    expect(cacheStorage.deleteCallsCount).toBe(1);
  })
  
  it('should call delete with call correct key', async () => {
    const { cacheStorage, sut } = makeSut();
    await sut.save();
    expect(cacheStorage.key).toBe('purchases');
  })
}
