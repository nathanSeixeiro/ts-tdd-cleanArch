import { LocalLoadPurchases } from "@/data/usecases"
import { CacheStoreSpy } from "@/data/tests"

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

    test('Should call correct key on load', async () => {
        const { cacheStore, sut } = makeSut()
        await sut.loadAll()
        expect(cacheStore.actions).toEqual([CacheStoreSpy.Actions.fetch])
        expect(cacheStore.fetchKey).toBe('purchases')
    })
})