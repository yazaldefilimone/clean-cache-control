class LocalSavePurchases{
  constructor(private readonly  cacheStorage:CacheStorage){} 
}

interface CacheStorage{

}

class CacheStorageSpy implements CacheStorage{
  deleteCallsCount = 0;
}


describe("LocalSavePurchases", () => {
  it('should not delete cache when call sut.init', () => {
    const cacheStorage = new CacheStorageSpy();
    new LocalSavePurchases(cacheStorage);
    expect(cacheStorage.deleteCallsCount).toBe(0);
  }) 
})
