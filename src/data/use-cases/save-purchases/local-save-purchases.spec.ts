import { LocalSavePurchases } from "@/data/use-cases";
import { CacheStorage } from "@/data/protocols/cache";
import { mockPurchase, CacheStorageSpy } from "@/data/tests";

type SutTypes = {
  cacheStorage:CacheStorage;
  sut: LocalSavePurchases
}


const makeSut = (timestamp = new Date()) :SutTypes => {
  const cacheStorage = new CacheStorageSpy();
  const sut = new LocalSavePurchases(cacheStorage, timestamp),
  return {
    cacheStorage,
    sut
  }
}

describe("LocalSavePurchases", () => {
  it('should not delete cache when call sut.init', () => {
    const { cacheStorage } = makeSut();
    expect(cacheStorage.messages).toEqual([]);
  }

  it('should delete old cache when call sut.save', async () => {
    const { cacheStorage, sut } = makeSut();
    await sut.save(mockPurchase());
    expect(cacheStorage.messages).toEqual([CacheStorageSpy.Message.delete, CacheStorageSpy.Message.insert]);

  })
  
  it('should call delete with call correct key', async () => {
    const { cacheStorage, sut } = makeSut();
    await sut.save(mockPurchase());
    expect(cacheStorage.deleteKey).toBe('purchases');
    expect(cacheStorage.messages).toEqual([CacheStorageSpy.Message.delete, CacheStorageSpy.Message.insert]);
  })

  it('should not insert new Cache if delete  fails', async () => {
    const { cacheStorage, sut } = makeSut();
    cacheStorage.simulateDeleteError();
    const promise = sut.save(mockPurchase());
    expect(cacheStorage.messages).toEqual([CacheStorageSpy.Message.delete]);
    await expect(promise).rejects.toThrow()
  })

  it('should insert new Cache if delete success', async () => {
    const timestamp = new Date();
    const { cacheStorage, sut } = makeSut(timestamp);
    const purchases = mockPurchase()
    const promise = sut.save(purchases);
    expect(cacheStorage.insertKey).toBe('purchases');
    expect(cacheStorage.insertKey).toBe('purchases')
    expect(cacheStorage.messages).toEqual([CacheStorageSpy.Message.delete, CacheStorageSpy.Message.insert]);
    expect(cacheStorage.insertValue).toEqual({ timestamp, value:purchases })
    await expect(promise).resolves.toBeFalsy()
  })
  
  it('should throw if insert throws', async () => {
    const { cacheStorage, sut } = makeSut();
    cacheStorage.simulateInsertError();
    const promise = sut.save(mockPurchase());
    expect(cacheStorage.messages).toEqual([CacheStorageSpy.Message.delete, CacheStorageSpy.Message.insert]);
    await expect(promise).rejects.toThrow()
  })  
}


