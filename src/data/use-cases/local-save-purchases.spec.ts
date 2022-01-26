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
}
