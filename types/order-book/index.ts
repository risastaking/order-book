import { DeltaEvent } from '../events'

export type OrderFeed = [number, number]
export type OrderSide = 'bid' | 'ask'
export interface Order {
    side: OrderSide
    price: number
    size: number
    total: number
}

export class OrderBook {
    protected bids: Order[] = []
    protected asks: Order[] = []
    protected spread: number =
        this.asks.slice(-1)[0]?.price - this.bids[0]?.price || 0

    //asks ascending
    //bids descending
    constructor(bids: OrderFeed[], asks: OrderFeed[]) {
        this.pushOrdersTo(this.bids, bids, 'bid')
        this.pushOrdersTo(this.asks, asks, 'ask')
    }
    private pushOrdersTo(dest: Order[], orders: OrderFeed[], side: OrderSide) {
        for (let i = 0; i < orders.length; i++) {
            let prev = dest[i - 1],
                price = orders[i][0],
                size = orders[i][1],
                total = i === 0 ? size : prev.total + size
            if (size !== 0) {
                dest.push({ side, price, size, total } as Order)
            } else {
                this.deleteOrdersFrom(dest, price, side)
            }
        }
    }

    private deleteOrdersFrom(from: Order[], price: number, side: OrderSide) {
        let deleteIndex = from.findIndex((o) => o.price === price)
        if (deleteIndex !== -1) {
            from.splice(deleteIndex, 1)
            this.sumSizes(deleteIndex, side)
        }
    }
    public applyDeltas(bids: OrderFeed[], asks: OrderFeed[]): OrderBook {
        this.insertOrdersTo(this.bids, bids, 'bid')
        this.insertOrdersTo(this.asks, asks, 'ask')
        return this
    }
    private insertOrdersTo(dest: Order[], orders: OrderFeed[], side: OrderSide) {
        orders.forEach((o: OrderFeed) => {
            this.insertOrderTo(dest, { price: o[0], size: o[1], side } as Order)
        })
    }

    private insertOrderTo(dest: Order[], order: Order): void {
        if (order.size === 0) {
            this.deleteOrdersFrom(dest, order.price, order.side)
            return
        }

        let insertIndex = dest.findIndex((o) => o.price === order.price)
        if (insertIndex !== -1) {
            dest[insertIndex].size = order.size
            // todo - check if we need to update total
            this.sumSizes(insertIndex, order.side)
        } else {
            // todo: insert new order at correct index
        }
    }

    private sumSizes(fromIndex: number, side: OrderSide) {
        if (side === 'bid') {
            for (let i = fromIndex; i < this.bids.length; i++) {
                let order = this.bids[i]
                order.total =
                    i === 0 ? order.size : this.bids[i - 1].total + order.size
            }
        } else {
            for (let i = fromIndex - 1; i >= this.asks.length; i--) {
                let order = this.asks[i]
                order.total =
                    i === this.asks.length - 1
                        ? order.size
                        : this.asks[i + 1].total + order.size
            }
        }
    }
}
