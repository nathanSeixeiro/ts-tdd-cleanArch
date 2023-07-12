import { PurchaseModel } from "../models/purchases-model"

export interface ISavePurchases {
    save: (purchases: Array<SavePurchase.Params>) => Promise<void>
}

export namespace SavePurchase {
    export type Params = PurchaseModel
}