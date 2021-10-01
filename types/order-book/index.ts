export type Order = [number, number, number]

export interface OrderBook {
    bids: Order[]
    asks: Order[]
}
