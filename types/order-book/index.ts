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
    private pushOrdersTo(to: Order[], orders: OrderFeed[], side: OrderSide) {
        for (let i = 0; i < orders.length; i++) {
            let prev = to[i - 1],
                price = orders[i][0],
                size = orders[i][1],
                total = i === 0 ? size : prev.total + size
            if (size !== 0) {
                to.push({ side, price, size, total } as Order)
            } else {
                this.deleteOrdersFrom(to, price, side)
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
    //addBids = (bids: OrderFeed[]) { }
    //iterate list
    //keep running total
    // if price matches, update order size, total - splice if size is 0
    // keep orders sorted at all times!

    // for (let newOrder of bids) {
    //     let total = 0
    //     if(newOrder[1] === 0) {
    //         this.bids.delete(newOrder[0])
    //     }
    //     for(let order of this.bids) {
    //         // set new bid

    //     }
    //}
}
