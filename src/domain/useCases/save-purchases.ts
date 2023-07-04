export interface ISavePurchases {
    save: (purchases: Array<SavePurchase.Params>) => Promise<void>
}

export namespace SavePurchase {
    export type Params ={
        id: String
        date: Date
        value: number
    }
    
}