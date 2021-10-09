export type OrderFeed = [number, number]
export enum OrderSide {
    BID = 'bid',
    ASK = 'ask',
}
export interface Order {
    price: number
    size: number
    total: number
}
