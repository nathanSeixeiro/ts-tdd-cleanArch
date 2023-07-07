import { SavePurchase } from "@/domain/useCases"
import { CacheStore } from "../protocols/cache"

export class CacheStoreSpy implements CacheStore {
    deleteKey: string
    insertKey: string
    messages: Array<CacheStoreSpy.Message> = []
    insertValues: Array<SavePurchase.Params> = []

    delete(key: string): void {
        this.messages.push(CacheStoreSpy.Message.delete)
        this.deleteKey = key
    }

    insert(key: string, value: any) {
        this.messages.push(CacheStoreSpy.Message.insert)
        this.insertKey = key
        this.insertValues = value
    }

    simuleteDeleteError(): void {
        jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
            this.messages.push(CacheStoreSpy.Message.delete)
            throw new Error()
        })
    }

    simuleteInsertError(): void {
        jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
            this.messages.push(CacheStoreSpy.Message.insert)
            throw new Error()
        })
    }
}

export namespace CacheStoreSpy {
    export enum Message {
        delete,
        insert
    }
}