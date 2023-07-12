import { CacheStore } from "@/data/protocols/cache";
import { ISavePurchases, SavePurchase } from "@/domain/useCases";

export class LocalSavePurchases implements ISavePurchases {
    constructor(
        private readonly cacheStore: CacheStore,
        private timestamps: Date
    ) { }

    async save(purchases: Array<SavePurchase.Params>): Promise<void> {
        this.cacheStore.delete('purchases')
        this.cacheStore.insert('purchases', {
            timestamps: this.timestamps,
            value: purchases
        })
    }
}