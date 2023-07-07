import { LocalSavePurchases } from "@/data/usecases"
import { CacheStoreSpy, mockPurchases } from "@/data/tests"

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


describe('LocalSavedPurchases', () => {
    test('Should not delete cache on sut.init', () => {
        const { cacheStore } = makeSut()

        expect(cacheStore.deleteCallsCount).toBe(0)
    })

    test('Should delete old cache on sut.save and call delete with correct key ', async () => {
        const { cacheStore, sut } = makeSut()
        await sut.save(mockPurchases())
        expect(cacheStore.deleteCallsCount).toBe(1)
        expect(cacheStore.deleteKey).toBe('purchases')
    })

    test('Should throws if delete throws', () => {
        const { cacheStore, sut } = makeSut()
        cacheStore.simuleteDeleteError()
        const promise = sut.save(mockPurchases())
        expect(cacheStore.insertCallsCount).toBe(0)
        expect(promise).rejects.toThrow()
    })
    
    test('Should insert new  cache if delete succeds', async () => {
        const { cacheStore, sut } = makeSut()
        const purchases = mockPurchases()
        await sut.save(purchases)
        expect(cacheStore.deleteCallsCount).toBe(1)
        expect(cacheStore.insertCallsCount).toBe(1)
        expect(cacheStore.insertKey).toBe('purchases')
        expect(cacheStore.insertValues).toEqual(purchases)
    })
    
    test('Should throws if insert throws', () => {
        const { cacheStore, sut } = makeSut()
        cacheStore.simuleteInsertError()
        const promise = sut.save(mockPurchases())
        expect(promise).rejects.toThrow()
    })

    test('Should throws if insert throws', () => {
        
    })

})