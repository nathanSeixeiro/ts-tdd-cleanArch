import { CacheStore } from "@/data/protocols/cache"
import { SavePurchase } from "@/domain/useCases"

const maxDateInDays = 3

export const getCacheExpirationDate = (timestamp: Date): Date => {
    const maxAge = new Date(timestamp)
    maxAge.setDate(maxAge.getDate() - maxDateInDays)
    return maxAge
}

export class CacheStoreSpy implements CacheStore {
    deleteKey: string
    insertKey: string
    fetchKey: string
    actions: Array<CacheStoreSpy.Actions> = []
    insertValues: Array<SavePurchase.Params> = []
    fetchResult: any

    fetch(key: string): any {
        this.actions.push(CacheStoreSpy.Actions.fetch)
        this.fetchKey = key
        return this.fetchResult
    }

    delete(key: string): void {
        this.actions.push(CacheStoreSpy.Actions.delete)
        this.deleteKey = key
    }

    insert(key: string, value: any) {
        this.actions.push(CacheStoreSpy.Actions.insert)
        this.insertKey = key
        this.insertValues = value
    }

    replace(key: string, value: any) {
        this.delete(key)
        this.insert(key, value)
    }

    simuleteDeleteError(): void {
        jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
            this.actions.push(CacheStoreSpy.Actions.delete)
            throw new Error()
        })
    }

    simuleteInsertError(): void {
        jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
            this.actions.push(CacheStoreSpy.Actions.insert)
            throw new Error()
        })
    }
   
    simuleteFetchError(): void {
        jest.spyOn(CacheStoreSpy.prototype, 'fetch').mockImplementationOnce(() => {
            this.actions.push(CacheStoreSpy.Actions.fetch)
            throw new Error()
        })
    }
}

export namespace CacheStoreSpy {
    export enum Actions {
        delete,
        insert,
        fetch
    }
}