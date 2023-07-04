import { CacheStore } from "@/data/protocols/cache"
import { LocalSavePurchases } from "@/data/usecases"
import { SavePurchase } from "@/domain"

class CacheStoreSpy implements CacheStore {
    deleteCallsCount = 0
    insertCallsCount = 0
    deleteKey: string
    insertKey: string
    insertValues: Array<SavePurchase.Params> = []

    delete(key: string): void {
        this.deleteCallsCount++
        this.deleteKey = key
    }

    insert(key: string, value: any) {
        this.insertCallsCount++
        this.insertKey = key
        this.insertValues = value
    }
}

type TypeSut = {
    sut: LocalSavePurchases
    cacheStore: CacheStoreSpy
}

const makeSut = (): TypeSut => {
    const cacheStore = new CacheStoreSpy()
    const sut = new LocalSavePurchases(cacheStore)
    return {
        sut, cacheStore
    }
}

const mockPurchases = (): Array<SavePurchase.Params> => [
    {
        id: '1',
        date: new Date(),
        value: 40
    }, 
    {
        id: '2',
        date: new Date(),
        value: 50
    }
]
const purchases = mockPurchases()

describe('LocalSavedPurchases', () => {
    test('Should not delete cache on sut.init', () => {
        const { cacheStore } = makeSut()

        expect(cacheStore.deleteCallsCount).toBe(0)
    })

    test('Should delete old cache on sut.save and call delete with correct key ', async () => {
        const { cacheStore, sut } = makeSut()
        await sut.save(purchases)
        expect(cacheStore.deleteCallsCount).toBe(1)
        expect(cacheStore.deleteKey).toBe('purchases')
    })

    test('Should not save insert cache if delete fails', () => {
        const { cacheStore, sut } = makeSut()
        jest.spyOn(cacheStore, 'delete').mockImplementationOnce(() => { throw new Error() })
        const promise = sut.save(purchases)
        expect(cacheStore.insertCallsCount).toBe(0)
        expect(promise).rejects.toThrow()
    })

    test('Should insert new  cache if delete succeds', async () => {
        const { cacheStore, sut } = makeSut()
        // const purchases = mockPurchases()
        await sut.save(purchases)
        expect(cacheStore.deleteCallsCount).toBe(1)
        expect(cacheStore.insertCallsCount).toBe(1)
        expect(cacheStore.insertKey).toBe('purchases')
        expect(cacheStore.insertValues).toEqual(purchases)
    })

})