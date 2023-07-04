export interface CacheStore {
    insert: (key: string, value: any) => void
    delete: (key: string) => void
}