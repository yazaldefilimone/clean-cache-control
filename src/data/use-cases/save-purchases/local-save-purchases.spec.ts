import { LocalSavePurchases } from "@/data/use-cases";
import { CacheStorage } from "@/data/protocols/cache";

class CacheStorageSpy implements CacheStorage{
  deleteCallsCount = 0;
  insertCallsCount = 0;
  key:string

  delete(key:string):void{
    this.deleteCallsCount++;
    this.key = key
  }
  insert():void{
    this.insertCallsCount++
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

  it('should not insert new Cache if delete  fails', async () => {
    const { cacheStorage, sut } = makeSut();
    jest.spyOn(cacheStorage, 'delete').mockImplementationOnce(() => { throw new Error() });
    const promise = sut.save();
    expect(cacheStorage.insertCallsCount).toBe(0);
    expect(promise).rejects.toThrow()
  })
}
