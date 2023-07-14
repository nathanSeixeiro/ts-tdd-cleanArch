import { LocalLoadPurchases } from "@/data/usecases"
import { CacheStoreSpy, getCacheExpirationDate } from "@/data/tests"

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

    test('Should delete cache if load fails', () => {
        const { cacheStore, sut } = makeSut()
        cacheStore.simuleteFetchError()
        sut.validate()
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Actions.fetch, CacheStoreSpy.Actions.delete])
        expect(cacheStore.deleteKey).toBe('purchases')
    })

    test('Should has not side effects if load succeds', () => {
        const currentDate = new Date()
        const timestamp = getCacheExpirationDate(currentDate)
        timestamp.setSeconds(timestamp.getSeconds() + 1)
        const { cacheStore, sut } = makeSut(currentDate)
        cacheStore.fetchResult = { timestamp }
        sut.validate()
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Actions.fetch])
        expect(cacheStore.fetchKey).toBe('purchases')
    })

    test('Should delete cache if its expired', () => {
        const currentDate = new Date()
        const timestamp = getCacheExpirationDate(currentDate)
        timestamp.setSeconds(timestamp.getSeconds() - 1)

        const { cacheStore, sut } = makeSut(currentDate)
        cacheStore.fetchResult = { timestamp }
        sut.validate()

        expect(cacheStore.actions).toEqual([CacheStoreSpy.Actions.fetch, CacheStoreSpy.Actions.delete])
        expect(cacheStore.fetchKey).toBe('purchases')
        expect(cacheStore.deleteKey).toBe('purchases')
    })

    test('Should delete cache if its on expiration date', () => {
        const currentDate = new Date()
        const timestamp = getCacheExpirationDate(currentDate)

        const { cacheStore, sut } = makeSut(currentDate)
        cacheStore.fetchResult = { timestamp }
        sut.validate()

        expect(cacheStore.actions).toEqual([CacheStoreSpy.Actions.fetch, CacheStoreSpy.Actions.delete])
        expect(cacheStore.fetchKey).toBe('purchases')
        expect(cacheStore.deleteKey).toBe('purchases')
    })
})