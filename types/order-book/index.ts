export type Order = [number, number, number]

export interface OrderBook {
    bids: Order[]
    asks: Order[]
}

export class OrderBook implements OrderBook {
    constructor(public bids: Order[], public asks: Order[]) {


        this.calculateTotals()
    }
    calculateTotals(): void {
        this.bids.sort((a, b) => a[0] - b[0])
        this.bids = this.sumOrders(this.bids)
        this.bids.sort((a, b) => b[0] - a[0])

        this.asks.sort((a, b) => b[0] - a[0])
        this.asks = this.sumOrders(this.asks)
    }
    sumOrders = (orders: Order[]): Order[] =>
        orders.map((order, i) =>
            [order[0], order[1], orders.slice(0, i + 1).reduce((a, b) =>
                a + b[1], 0)])
}