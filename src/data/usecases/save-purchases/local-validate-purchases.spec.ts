import { LocalLoadPurchases } from "@/data/usecases"
import { CacheStoreSpy, getCacheExpirationDate, mockPurchases } from "@/data/tests"

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
        expect(cacheStore.actions).toEqual([ CacheStoreSpy.Actions.fetch, CacheStoreSpy.Actions.delete])
        expect(cacheStore.deleteKey).toBe('purchases')
    })
})