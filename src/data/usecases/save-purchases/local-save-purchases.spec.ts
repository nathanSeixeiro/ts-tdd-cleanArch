import { LocalSavePurchases } from "@/data/usecases"
import { CacheStoreSpy, mockPurchases } from "@/data/tests"

type TypeSut = {
    sut: LocalSavePurchases
    cacheStore: CacheStoreSpy
}

const makeSut = (timestamps = new Date()): TypeSut => {
    const cacheStore = new CacheStoreSpy()
    const sut = new LocalSavePurchases(cacheStore, timestamps)
    return {
        sut, cacheStore
    }
}


describe('LocalSavedPurchases', () => {
    test('Should not delete cache on sut.init', () => {
        const { cacheStore } = makeSut()
        expect(cacheStore.messages).toEqual([])
    })
    
    test('Should not insert new Cache if delete fails', async () => {
        const { cacheStore, sut } = makeSut()
        cacheStore.simuleteDeleteError()
        const promise = sut.save(mockPurchases())
        expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete])
        await expect(promise).rejects.toThrow()
    })
    
    test('Should insert new  cache if delete succeds', async () => {
        const timestamps = new Date()
        const { cacheStore, sut } = makeSut()
        const purchases = mockPurchases()
        await sut.save(purchases)
        expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
        expect(cacheStore.deleteKey).toBe('purchases')
        expect(cacheStore.insertKey).toBe('purchases')
        expect(cacheStore.insertValues).toEqual({
            timestamps,
            value: purchases
        })
    })
    
    test('Should throws if insert throws', async () => {
        const { cacheStore, sut } = makeSut()
        cacheStore.simuleteInsertError()
        const promise = sut.save(mockPurchases())
        expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert])
        await expect(promise).rejects.toThrow()
    })

})