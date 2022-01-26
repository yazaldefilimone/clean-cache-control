class LocalSavePurchases{
  constructor(private readonly  cacheStorage:CacheStorage){} 

  save(): Promise<void>{
    this.cacheStorage.delete();
  }
}

interface CacheStorage{
  delete: () => void

}

class CacheStorageSpy implements CacheStorage{
  deleteCallsCount = 0;

  async delete():void{
    this.deleteCallsCount++
  }
}


describe("LocalSavePurchases", () => {
  it('should not delete cache when call sut.init', () => {
    const cacheStorage = new CacheStorageSpy();
    new LocalSavePurchases(cacheStorage);
    expect(cacheStorage.deleteCallsCount).toBe(0);
  }) 

  it('should delete old cache when call sut.save', async () => {
    const cacheStorage = new CacheStorageSpy();
    const sut = new LocalSavePurchases(cacheStorage);
    await sut.save();

    expect(cacheStorage.deleteCallsCount).toBe(1);
  })
}
