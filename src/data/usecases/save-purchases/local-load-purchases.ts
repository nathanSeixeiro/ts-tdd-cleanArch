import { CacheStore } from "@/data/protocols/cache";
import { ISavePurchases, SavePurchase } from "@/domain/useCases";

export class LocalLoadPurchases implements ISavePurchases {
    private readonly key = 'purchases'
    constructor(
        private readonly cacheStore: CacheStore,
        private timestamps: Date
    ) { }

    async save(purchases: Array<SavePurchase.Params>): Promise<void> {
        this.cacheStore.replace(this.key, {
            timestamps: this.timestamps,
            value: purchases
        })
    }

    async loadAll(): Promise<void>{
        this.cacheStore.fetch(this.key)

    } 
}