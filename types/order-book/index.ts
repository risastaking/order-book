// lodash seems to perform better than native with sorted data
// https://www.measurethat.net/Benchmarks/ShowResult/228038
import _findIndex from 'lodash/findIndex'
import _sortedIndexBy from 'lodash/sortedIndexBy'

export type OrderFeed = [number, number]
export type OrderSide = 'bid' | 'ask'
export interface Order {
    side: OrderSide
    price: number
    size: number
    total: number
}

export class OrderBook {
    public levelsDeep = 10
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

    public applyDeltas(bids: OrderFeed[], asks: OrderFeed[]): OrderBook {
        this.insertOrdersTo(this.bids, bids, 'bid')
        this.insertOrdersTo(this.asks, asks, 'ask')
        return this
    }

    private pushOrdersTo(dest: Order[], orders: OrderFeed[], side: OrderSide) {
        for (let i = 0; i < orders.length; i++) {
            let prev = dest[i - 1],
                price = orders[i][0],
                size = orders[i][1],
                total = i === 0 ? size : prev.total + size
            dest.push({ side, price, size, total } as Order)
        }
    }

    private deleteOrdersFrom(from: Order[], price: number, side: OrderSide) {
        let deleteIndex = _findIndex(from, (o: Order) => o.price === price)
        if (deleteIndex !== -1) {
            from.splice(deleteIndex, 1)
            this.sumSizes(deleteIndex, side)
        }
    }
    private insertOrdersTo(
        dest: Order[],
        orders: OrderFeed[],
        side: OrderSide
    ) {
        orders.forEach((o: OrderFeed) => {
            this.upsertOrder(dest, { price: o[0], size: o[1], side } as Order)
        })
    }

    /**
     * Iterate by price.
     * BIDS are sorted DESCENDING
     * ASKS are sorted ASCENDING
     * We use this to iterate
     * different directions based on the side
     */
    private orderBookIteratee = (o: Order) =>
        o.side === 'bid' ? -o.price : o.price

    private upsertOrder(dest: Order[], order: Order): void {
        let updateIndex =  _findIndex(dest, (o: Order) => o.price === order.price)

        if (updateIndex !== -1) {
            dest[updateIndex].size = order.size
            this.sumSizes(updateIndex, order.side)
        } else {
            debugger
            let insertIndex = _sortedIndexBy(dest, order, this.orderBookIteratee)
            dest.splice(insertIndex,0,order)
            this.sumSizes(insertIndex, order.side)
        }
    }

    private sumSizes(fromIndex: number, side: OrderSide) {
        if (side === 'bid') {
            for (let i = fromIndex; i < this.bids.length; i++) {
                let order = this.bids[i] || { size: 0 },
                    prev = this.bids[i - 1] || { total: 0 }
                order.total = i === 0 ? order.size : prev.total + order.size
            }
        } else {
            for (let i = fromIndex - 1; i >= this.asks.length; i--) {
                let order = this.asks[i] || { size: 0 },
                    prev = this.asks[i + 1] || { total: 0 }
                order.total =
                    i === this.asks.length - 1
                        ? order.size
                        : prev.total + order.size
            }
        }
        this.trimOrders()
        
        //TODO: prune 0 value orders
    }

    private trimOrders() {
        this.bids.length = this.levelsDeep
        this.asks.splice(0, this.asks.length - this.levelsDeep)
    }
}
