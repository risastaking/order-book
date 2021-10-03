// lodash seems to perform better than native with sorted data
// https://www.measurethat.net/Benchmarks/ShowResult/228038
import _findIndex from 'lodash/findIndex'
import _sortedIndexBy from 'lodash/sortedIndexBy'
import { flow } from 'lodash/fp'
import { round } from '../../formats'

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
    public bids: Order[] = []
    public asks: Order[] = []
    readonly spread = () => this.topAsk() - this.topBid()
    readonly spreadPercent = () => round((this.spread() / this.topBid()) * 100)
    private topBid = (): number => this.bids[0]?.price
    private topAsk = (): number => this.asks.slice(-1)[0]?.price

    //asks ascending
    //bids descending
    constructor(bids: OrderFeed[], asks: OrderFeed[]) {
        //TODO: verify input is sorted properly
        this.bids = this.mapSnapshot(bids, 'bid')
        this.asks = this.mapSnapshot(asks, 'ask')
    }

    private mapSnapshot = (orders: OrderFeed[], side: OrderSide): Order[] =>
        orders.reduce((acc, curr, i) => {
            const prevTotal = i > 0 ? acc[i - 1].total : 0
            return [
                ...acc,
                {
                    price: curr[0],
                    size: curr[1],
                    total: prevTotal + curr[1],
                    side,
                },
            ]
        }, [] as Order[])

    public applyDeltas = (bids: OrderFeed[], asks: OrderFeed[]) =>
        flow(
            this.mapOrders,
            this.upsertOrders,
            this.filterZeroSizes,
            this.sumSizes,
            this.trimOrders
        )(bids, asks)

    private mapOrders = (bids: OrderFeed[], asks: OrderFeed[]) =>
        bids
            .map((o) => {
                return {
                    price: o[0],
                    size: o[1],
                    side: 'bid',
                } as Order
            })
            .concat(
                asks.map((o) => {
                    return {
                        price: o[0],
                        size: o[1],
                        side: 'ask',
                    } as Order
                })
            )

    private upsertOrders = (orders: Order[]) => {
        orders.map((o: Order) => this.upsertOrder(o))
        return this
    }

    /**
     * Iterate by price.
     * BIDS are sorted DESCENDING
     * ASKS are sorted ASCENDING
     * We use this to iterate
     * different directions based on the side
     */
    private orderBookIteratee = (o: Order) =>
        o?.side === 'bid' ? -o?.price : o?.price

    private upsertOrder = (order: Order) => {
        let orders = order.side === 'bid' ? this.bids : this.asks
        let updateIndex = _findIndex(
            orders,
            (o: Order) => o?.price === order.price
        )

        if (updateIndex !== -1) {
            orders[updateIndex].size = order.size
        } else {
            let insertIndex = _sortedIndexBy(
                orders,
                order,
                this.orderBookIteratee
            )
            orders.splice(insertIndex, 0, order)
        }
        return this
    }

    private sumSizes = (book: OrderBook) => {
        for (let i = 0; i < book.bids.length - 1; i++) {
            let order = book.bids[i],
                prev = book.bids[i - 1]
            order.total = i === 0 ? order.size : prev.total + order.size
        }

        for (let i = book.asks.length - 1; i >= 0; i--) {
            let order = book.asks[i],
                prev = book.asks[i + 1]
            order.total =
                i === book.asks.length - 1
                    ? order.size
                    : prev.total + order.size
        }
        return book
    }
    private filterZeroSizes = (book: OrderBook) => {
        book.bids = book.bids.filter((o) => o.size > 0)
        book.asks = book.asks.filter((o) => o.size > 0)

        return book
    }
    private trimOrders = (book: OrderBook) => {
        book.bids.length = book.levelsDeep
        book.asks.splice(0, book.asks.length - book.levelsDeep)
        return book
    }
}
