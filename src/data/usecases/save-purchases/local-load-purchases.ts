import { CacheStore } from "@/data/protocols/cache";
import { CachePolicy } from "@/data/protocols/cache/cache-police";
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
            return CachePolicy.validate(cache.timestamp, this.currentDate)? cache.value : []
        } catch (error) {
            return []
        }
    }

    validate(): void { 
        try{
            const cache = this.cacheStore.fetch(this.key)
            if (!CachePolicy.validate(cache.timestamp, this.currentDate)) {
                throw new Error()
            }
        } catch(error){
            this.cacheStore.delete(this.key)
        }
    }
}