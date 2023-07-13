import { CacheStore } from "@/data/protocols/cache";
import { ISavePurchases, SavePurchase, ILoadPurchases, LoadPurchase } from "@/domain/useCases";

export class LocalLoadPurchases implements ISavePurchases, ILoadPurchases {
    private readonly key = 'purchases'
    constructor(private readonly cacheStore: CacheStore, private timestamps: Date) { }

    async save(purchases: Array<SavePurchase.Params>): Promise<void> {
        this.cacheStore.replace(this.key, {
            timestamps: this.timestamps,
            value: purchases
        })
    }

    async loadAll(): Promise<Array<LoadPurchase.Result>> {
        try {
            this.cacheStore.fetch(this.key)
            return []
        } catch (error) {
            this.cacheStore.delete(this.key)
            return []
        }

    }
}