import { LocalSavePurchases } from "@/data/use-cases";
import { CacheStorage } from "@/data/protocols/cache";

class CacheStorageSpy implements CacheStorage{
  deleteCallsCount = 0;
  insertCallsCount = 0;
  deleteKey:string
  insertKey:string

  delete(key:string):void{
    this.deleteCallsCount++;
    this.deleteKey = key
  }
  
  insert(key:string):void{
    this.insertCallsCount++
    this.insertKey = key
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
    expect(cacheStorage.deleteKey).toBe('purchases');
  })

  it('should not insert new Cache if delete  fails', () => {
    const { cacheStorage, sut } = makeSut();
    jest.spyOn(cacheStorage, 'delete').mockImplementationOnce(() => { throw new Error() });
    const promise = sut.save();
    expect(cacheStorage.insertCallsCount).toBe(0);
    expect(promise).rejects.toThrow()
  })

  it('should insert new Cache if delete success', async () => {
    const { cacheStorage, sut } = makeSut();
    await sut.save();
    expect(cacheStorage.insertCallsCount).toBe(1);
    expect(cacheStorage.deleteCallsCount).toBe(1);
    expect(cacheStorage.insertKey).toBe('purchases');
  })

}
