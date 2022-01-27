import { LocalSavePurchases } from "@/data/use-cases";
import { CacheStorage } from "@/data/protocols/cache";
import { mockPurchase, CacheStorageSpy } from "@/data/tests";

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

  it('should not insert new Cache if delete  fails', async () => {
    const { cacheStorage, sut } = makeSut();
    cacheStorage.simulateDeleteError();
    const promise = sut.save(mockPurchase());
    expect(cacheStorage.insertCallsCount).toBe(0);
    await expect(promise).rejects.toThrow()
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
  
  it('should throw if insert throws', async () => {
    const { cacheStorage, sut } = makeSut();
    cacheStorage.simulateInsertError();
    const promise = sut.save(mockPurchase());
    await expect(promise).rejects.toThrow()
  })  
}
