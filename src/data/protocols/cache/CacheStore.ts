export interface CacheStorage{
  delete: (key:string) => void
  insert: () => void
}
