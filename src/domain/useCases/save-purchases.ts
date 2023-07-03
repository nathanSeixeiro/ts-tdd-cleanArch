export interface SavePurchases {
    save: (purchases: Array<SavePurchase.Params>) => Promise<void>
}

namespace SavePurchase {
    export type Params ={
        id: String
        date: Date
        value: number
    }
    
}