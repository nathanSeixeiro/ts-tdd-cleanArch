import { PurchaseModel } from "../models/purchases-model"

export interface ILoadPurchases {
    loadAll: () => Promise<Array<LoadPurchase.Result>>
}

export namespace LoadPurchase {
    export type Result = PurchaseModel
}