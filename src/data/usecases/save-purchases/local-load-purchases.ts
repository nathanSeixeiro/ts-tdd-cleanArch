import { CacheStore } from "@/data/protocols/cache";
import { ISavePurchases, SavePurchase, ILoadPurchases, LoadPurchase } from "@/domain/useCases";

export class LocalLoadPurchases implements ISavePurchases, ILoadPurchases {
    private readonly key = 'purchases'
    constructor(private readonly cacheStore: CacheStore, private currentDate: Date) { }

    async save(purchases: Array<SavePurchase.Params>): Promise<void> {
        this.cacheStore.replace(this.key, {
            timestamps: this.currentDate,
            value: purchases
        })
    }

    async loadAll(): Promise<Array<LoadPurchase.Result>> {
        try {
            const cache = this.cacheStore.fetch(this.key)
            const maxAge = new Date(cache.timestamp)
            maxAge.setDate(maxAge.getDate() + 3)

            if( maxAge > this.currentDate){
                return cache.value
            }else {
                throw new Error()
            }
        } catch (error) {
            this.cacheStore.delete(this.key)
            return []
        }

    }
}