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

        //TODO: verify input is sorted properly
        this.insertOrders(this.bids, bids, 'bid')
        this.insertOrders(this.asks, asks, 'ask')
    }

    public applyDeltas(bids: OrderFeed[], asks: OrderFeed[]): OrderBook {
        this.upsertOrders(this.bids, bids, 'bid')
        this.upsertOrders(this.asks, asks, 'ask')
        return this
    }

    private insertOrders(dest: Order[], orders: OrderFeed[], side: OrderSide) {
        for (let i = 0; i < orders.length; i++) {
            let prev = dest[i - 1],
                price = orders[i][0],
                size = orders[i][1],
                total = i === 0 ? size : prev.total + size
            dest.push({ side, price, size, total } as Order)
        }
    }

    private upsertOrders(
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
            let insertIndex = _sortedIndexBy(dest, order, this.orderBookIteratee)
            dest.splice(insertIndex,0,order)
            this.sumSizes(insertIndex, order.side)
        }
    }

    private sumSizes(fromIndex: number, side: OrderSide) {
        if (side === 'bid') {
            for (let i = fromIndex; i < this.bids.length; i++) {
                let order = this.bids[i] || { size: 0 }, //TODO: can we remove || when locking array?
                    prev = this.bids[i - 1]
                order.total = i === 0 ? order.size : prev.total + order.size
                if(order.size === 0) {
                    this.bids.splice(i, 1)
                    i--
                }
            }
        } else {
            for (let i = fromIndex - 1; i >= this.asks.length; i--) {
                let order = this.asks[i] || { size: 0 }, //TODO: can we remove || when locking array?
                    prev = this.asks[i + 1]
                order.total =
                    i === this.asks.length - 1
                        ? order.size
                        : prev.total + order.size
                        if(order.size === 0) {
                            this.asks.splice(i, 1)
                            i++
                        }
            }
        }

        //TODO: prune 0 value orders

        this.trimOrders()
    }

    private trimOrders() {
        this.bids.length = this.levelsDeep
        this.asks.splice(0, this.asks.length - this.levelsDeep)
    }
}
