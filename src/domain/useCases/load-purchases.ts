import { PurchaseModel } from "@/domain/models"

export interface ILoadPurchases {
    loadAll: () => Promise<Array<LoadPurchase.Result>>
}

export namespace LoadPurchase {
    export type Result = PurchaseModel
}