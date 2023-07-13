import { LocalLoadPurchases } from "@/data/usecases"
import { CacheStoreSpy, mockPurchases } from "@/data/tests"

type TypeSut = {
    sut: LocalLoadPurchases
    cacheStore: CacheStoreSpy
}

const makeSut = (timestamps = new Date()): TypeSut => {
    const cacheStore = new CacheStoreSpy()
    const sut = new LocalLoadPurchases(cacheStore, timestamps)
    return {
        sut, cacheStore
    }
}


describe('LocalSavedPurchases', () => {
    test('Should not delete cache on sut.init', () => {
        const { cacheStore } = makeSut()
        expect(cacheStore.actions).toEqual([])
    })
   
    test('Should return empty list if load fails', async () => {
        const { cacheStore, sut } = makeSut()
        cacheStore.simuleteFetchError()
        const promise = await sut.loadAll()
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Actions.fetch, CacheStoreSpy.Actions.delete])
        expect(cacheStore.deleteKey).toBe('purchases')
        expect(promise).toEqual([])
    })

    test('Should return a list of purchases if cache is less than 3 days old', async () => {
        const currentDate = new Date()
        const timestamp = new Date(currentDate)
        timestamp.setDate(timestamp.getDate() - 3)
        timestamp.setSeconds(timestamp.getSeconds() + 1)
        const { cacheStore, sut } = makeSut(currentDate)
        cacheStore.fetchResult = {
            timestamp,
            value: mockPurchases()
        }
        const purchases = await sut.loadAll()
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Actions.fetch])
        expect(cacheStore.fetchKey).toBe('purchases')
        expect(purchases).toEqual(cacheStore.fetchResult.value)
    })
   
    test('Should return an empty list of purchases if cache is more than 3 days old', async () => {
        const currentDate = new Date()
        const timestamp = new Date(currentDate)
        timestamp.setDate(timestamp.getDate() - 3)
        timestamp.setSeconds(timestamp.getSeconds() - 1)

        const { cacheStore, sut } = makeSut(currentDate)
        cacheStore.fetchResult = {
            timestamp,
            value: mockPurchases()
        }
        const purchases = await sut.loadAll()

        expect(cacheStore.actions).toEqual([CacheStoreSpy.Actions.fetch, CacheStoreSpy.Actions.delete])
        expect(cacheStore.fetchKey).toBe('purchases')
        expect(cacheStore.deleteKey).toBe('purchases')
        expect(purchases).toEqual([])
    })
})