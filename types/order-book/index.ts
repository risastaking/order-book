export type Order = [number, number]

export interface OrderBook {
    asks: Order[]
    bids: Order[]
}

export class OrderBook implements OrderBook {
    constructor(public asks: Order[], public bids: Order[]) {
    }
}