import { SavePurchase } from "@/domain/useCases"
import { CacheStore } from "../protocols/cache"

export class CacheStoreSpy implements CacheStore {
    deleteKey: string
    insertKey: string
    actions: Array<CacheStoreSpy.Actions> = []
    insertValues: Array<SavePurchase.Params> = []

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
}

export namespace CacheStoreSpy {
    export enum Actions {
        delete,
        insert
    }
}