import { SavePurchase } from "@/domain/useCases";

export const mockPurchases = (): Array<SavePurchase.Params> => [
    {
        id: '843434',
        date: new Date(),
        value: 40
    },
    {
        id: '265464656',
        date: new Date(),
        value: 50
    }
]