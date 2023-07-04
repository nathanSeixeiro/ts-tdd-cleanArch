import { CacheStore } from "@/data/protocols/cache";
import { ISavePurchases, SavePurchase } from "@/domain";

export class LocalSavePurchases implements ISavePurchases{
    constructor(private readonly cacheStore: CacheStore) { }

    async save(purchases: Array<SavePurchase.Params>): Promise<void> {
        this.cacheStore.delete('purchases')
        this.cacheStore.insert('purchases', purchases)
    }
}