import { CacheStorage } from "@/data/protocols/cache";

export class CacheStorageSpy implements CacheStorage{
  messages:Array<CacheStorageSpy.Message> = [];
  deleteKey:string
  insertKey:string
  insertValue:any

  delete(key:string):void{
    this.messages.push(CacheStorageSpy.Message.delete)
    this.deleteKey = key
  }
  
  insert(key:string, value:any):void{
    this.messages.push(CacheStorageSpy.Message.insert)
    this.insertKey = key;
    this.insertValue = value;
  }
  simulateDeleteError(): void{
    jest.spyOn(CacheStorageSpy.prototype, 'delete').mockImplementationOnce(() => { 
      this.messages.push(CacheStorageSpy.Message.delete)
      throw new Error() 
    });
  }
  simulateInsertError(): void{
    jest.spyOn(CacheStorageSpy.prototype, 'insert').mockImplementationOnce(() => { 
      this.messages.push(CacheStorageSpy.Message.insert)
      throw new Error() 
    });
  }
}


export namespace CacheStorageSpy{
  export enum Message{
    insert,
    delete
  }
}
