import { LocalSavePurchases } from "@/data/use-cases";
import { CacheStorage } from "@/data/protocols/cache";
import {SavePurchases} from "@/domain/use-cases";

class CacheStorageSpy implements CacheStorage{
  deleteCallsCount = 0;
  insertCallsCount = 0;
  deleteKey:string
  insertKey:string
  insertValue:any

  delete(key:string):void{
    this.deleteCallsCount++;
    this.deleteKey = key
  }
  
  insert(key:string, value:any):void{
    this.insertCallsCount++
    this.insertKey = key;
    this.insertValue = value;
  }
  simulateDeleteError(): void{
    jest.spyOn(CacheStorageSpy.prototype, 'delete').mockImplementationOnce(() => { throw new Error() });
  }
  simulateInsertError(): void{
    jest.spyOn(CacheStorageSpy.prototype, 'insert').mockImplementationOnce(() => { throw new Error() });
  }
}


const mockPurchase = ():Array<SavePurchases.Params> => {
  return [
    {
      id:'1',
      date:new Date(),
      value:27
    },
    {
      id:'2',
      date:new Date(),
      value:77
    },
  ]
}
type SutTypes = {
  cacheStorage:CacheStorage;
  sut: LocalSavePurchases
}
const makeSut = () :SutTypes => {
  const cacheStorage = new CacheStorageSpy();
  const sut = new LocalSavePurchases(cacheStorage),
  return {
    cacheStorage,
    sut
  }
}

describe("LocalSavePurchases", () => {
  it('should not delete cache when call sut.init', () => {
    const { cacheStorage } = makeSut();
    expect(cacheStorage.deleteCallsCount).toBe(0);
  }) 

  it('should delete old cache when call sut.save', async () => {
    const { cacheStorage, sut } = makeSut();
    await sut.save(mockPurchase());
    expect(cacheStorage.deleteCallsCount).toBe(1);
  })
  
  it('should call delete with call correct key', async () => {
    const { cacheStorage, sut } = makeSut();
    await sut.save(mockPurchase());
    expect(cacheStorage.deleteKey).toBe('purchases');
  })

  it('should not insert new Cache if delete  fails', () => {
    const { cacheStorage, sut } = makeSut();
    cacheStorage.simulateDeleteError();
    const promise = sut.save(mockPurchase());
    expect(cacheStorage.insertCallsCount).toBe(0);
    expect(promise).rejects.toThrow()
  })

  it('should insert new Cache if delete success', async () => {
    const { cacheStorage, sut } = makeSut();
    const purchases = mockPurchase()
    await sut.save(purchases);
    expect(cacheStorage.insertCallsCount).toBe(1);
    expect(cacheStorage.deleteCallsCount).toBe(1);
    expect(cacheStorage.insertKey).toBe('purchases');
    expect(cacheStorage.insertValue).toEqual(purchases)
  })
  
  it('should throw if insert throws', () => {
    const { cacheStorage, sut } = makeSut();
    cacheStorage.simulateInsertError();
    const promise = sut.save(mockPurchase());
    expect(promise).rejects.toThrow()
  })  
}
