import { CacheStorage } from "@/data/protocols/cache";

export class CacheStorageSpy implements CacheStorage{
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
