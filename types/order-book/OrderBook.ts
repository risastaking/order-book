// lodash seems to perform better than native with sorted data
// https://www.measurethat.net/Benchmarks/ShowResult/228038
import _findIndex from 'lodash/findIndex'
import _sortedIndexBy from 'lodash/sortedIndexBy'
import { flow } from 'lodash/fp'
import { round } from '../../formats'

export type OrderFeed = [number, number]
export type OrderSide = 'bid' | 'ask'
export interface Order {
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
        this.processFeed(bids, asks)
    }
    public processFeed = (bids: OrderFeed[], asks: OrderFeed[]) =>
        flow(
            this.applyOrders(bids, 'bid'),
            this.applyOrders(asks, 'ask'),
            () => this
        )(this)

    public applyOrders =
        (feed: OrderFeed[], side: OrderSide) => (book: OrderBook) =>
            flow(
                book.mapOrders,
                book.upsert(side),
                book.filterZeroSizes,
                book.sumSizes(side),
                book.trimOrders(side),
                (orders) => {
                    switch (side) {
                        case 'bid':
                            book.bids = [...orders]
                            break
                        case 'ask':
                            book.asks = [...orders]
                            break
                    }
                },
                () => book
            )(feed, side)

    private mapOrders = (feed: OrderFeed[], side: OrderSide): Order[] =>
        feed.map(this.mapOrder)

    private mapOrder = (feed: OrderFeed): Order => ({
        price: feed[0],
        size: feed[1],
        total: 0,
    })
    private upsert = (side: OrderSide) => (newOrders: Order[]) =>
        this.upsertSorted(side, newOrders)

    private sumSizes =
        (side: OrderSide) =>
        (orders: Order[]): Order[] => {
            switch (side) {
                case 'bid':
                    for (let i = 0; i < orders.length - 1; i++) {
                        let order = orders[i],
                            prev = orders[i - 1]
                        order.total =
                            i === 0 ? order.size : prev.total + order.size
                    }
                    return orders
                case 'ask':
                    for (let i = orders.length - 1; i >= 0; i--) {
                        let order = orders[i],
                            prev = orders[i + 1]
                        order.total =
                            i === orders.length - 1
                                ? order.size
                                : prev.total + order.size
                    }
                    return orders
                default:
                    return orders
            }
        }
    private filterZeroSizes = (orders: Order[]): Order[] =>
        orders.filter((o) => o.size > 0)

    private trimOrders =
        (side: OrderSide) =>
        (orders: Order[]): Order[] =>
            side === 'bid'
                ? orders.slice(0, this.levelsDeep)
                : orders.slice(-this.levelsDeep)

    /**
     * BIDS are sorted DESCENDING
     * ASKS are sorted ASCENDING
     * We use this to iterate
     * different directions based on the side
     */
    private upsertSorted = (side: OrderSide, newOrders: Order[]): Order[] =>
        newOrders.reduce(
            (acc: Order[], order: Order) => {
                let updateIndex = _findIndex(
                    acc,
                    (o: Order) => o?.price === order.price
                )

                if (updateIndex !== -1) {
                    acc[updateIndex].size = order.size
                } else {
                    let insertIndex = _sortedIndexBy(acc, order, (o: Order) =>
                        side === 'bid' ? -o.price : o.price
                    )
                    acc.splice(insertIndex, 0, order)
                }
                return acc
            },
            side === 'bid' ? this.bids : this.asks
        )
}
