export interface CacheStorage{
  delete: (key:string) => void
  insert: (key:string) => void
}
