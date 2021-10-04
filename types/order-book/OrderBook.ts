// lodash seems to perform better than native with sorted data
// https://www.measurethat.net/Benchmarks/ShowResult/228038
import _findIndex from 'lodash/findIndex'
import _sortedIndexBy from 'lodash/sortedIndexBy'
import { flow } from 'lodash/fp'
import { round } from '../../formats'

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

export class OrderBook {
    public levelsDeep = 10
    public bids: Order[] = []
    public asks: Order[] = []
    private highestBid = () => this.bids[0]?.price
    private lowestAsk = () => this.asks.slice(-1)[0]?.price
    readonly spread = () => this.lowestAsk() - this.highestBid()
    readonly midPoint = () => this.lowestAsk() + this.highestBid() / 2
    readonly spreadPercent = () => round((this.spread() / this.midPoint()) * 100)

    constructor(bids: OrderFeed[], asks: OrderFeed[]) {
        this.processFeed(bids, asks)
    }
    public processFeed = (bids: OrderFeed[], asks: OrderFeed[]) =>
        flow(
            this.processOrders(bids, OrderSide.BID),
            this.processOrders(asks, OrderSide.ASK),
            () => this
        )(this)

    private processOrders = (feed: OrderFeed[], side: OrderSide) => (book: OrderBook) =>
            flow(
                book.mapOrders,
                book.upsert(side),
                book.filterZeroSizes,
                book.sumOrders(side),
                book.trimOrders(side),
                book.commitOrders(side),
                () => book
            )(feed)

    private mapOrders = (feed: OrderFeed[]): Order[] => feed.map(this.mapOrder)

    private mapOrder = (feed: OrderFeed): Order => ({
        price: feed[0],
        size: feed[1],
        total: 0,
    })

    private sumOrders = (side: OrderSide) => (orders: Order[]): Order[] =>
        side === OrderSide.BID
            ? orders.reduce((acc, order, i) => {
                    acc[i].total =
                        i === 0 ? order.size : acc[i - 1].total + order.size
                    return acc
                }, orders)
            : orders.reduceRight((acc, order, i) => {
                    acc[i].total =
                        i === acc.length - 1
                            ? order.size
                            : acc[i + 1].total + order.size
                    return acc
                }, orders)

    private filterZeroSizes = (orders: Order[]): Order[] =>
        orders.filter((o) => o.size > 0)

    private trimOrders = (side: OrderSide) => (orders: Order[]): Order[] =>
        side === OrderSide.BID
            ? orders.slice(0, this.levelsDeep)
            : orders.slice(-this.levelsDeep)

    private upsert = (side: OrderSide) => (newOrders: Order[]): Order[] =>
        newOrders.reduce(
            (acc: Order[], order: Order) => {
                let updateIndex = _findIndex(
                    acc,
                    (o: Order) => o?.price === order.price
                )

                if (updateIndex !== -1) {
                    // Found an existing order, update it
                    acc[updateIndex].size = order.size
                } else {
                    // No existing order, insert it
                    let insertIndex = _sortedIndexBy(
                        acc,
                        order,
                        (o: Order) => -o.price
                    )
                    acc.splice(insertIndex, 0, order)
                }
                return acc
            },
            side === OrderSide.BID ? this.bids : this.asks
        )

    private commitOrders = (side: OrderSide) => (orders: Order[]) =>
        side === OrderSide.BID ? (this.bids = orders) : (this.asks = orders)
}
