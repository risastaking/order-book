// lodash seems to perform better than native with sorted data
// https://www.measurethat.net/Benchmarks/ShowResult/228038
import _findIndex from 'lodash/findIndex'
import _sortedIndexBy from 'lodash/sortedIndexBy'
import { flow, head, last } from 'lodash/fp'
import { round } from '../../formats'
import { Order, OrderFeed, OrderSide } from '../../types/OrderBook'
import { config } from '../../config'

export class OrderBook {
    public levelsDeep: number = config.levelsDeep
    public bids: Order[] = []
    public asks: Order[] = []
    private topAsk = () => last(this.asks)?.price || 0
    private topBid = () => head(this.bids)?.price || 0
    private hasSpread = () => this.bids.length > 0 && this.asks.length > 0
    public maxQuantity = 0

    readonly spread = (): number => this.hasSpread() ? round(this.topAsk() - this.topBid()) : 0
    readonly midPoint = (): number => this.topAsk() + this.topBid() / 2
    readonly spreadPercent = (): number => round((this.spread() / this.midPoint()) * 100) || 0

    constructor(bids: OrderFeed[], asks: OrderFeed[]) {
        this.processFeed(bids, asks)
    }
    public processFeed = (bids: OrderFeed[], asks: OrderFeed[]): OrderBook => {
        this.maxQuantity = 0
        flow(
            this.processOrders(bids, OrderSide.BID),
            this.processOrders(asks, OrderSide.ASK),
            () => this
        )()

        this.bids = this.calculatePercentOfBook(this.bids)
        this.asks = this.calculatePercentOfBook(this.asks)

        return this
    }

    private processOrders = (feed: OrderFeed[], side: OrderSide) => () =>
        flow(
            this.mapOrders,
            this.upsert(side),
            this.filterEmptyOrders,
            this.sumOrders(side),
            this.trimBook(side),
            this.commitOrders(side),
            () => this
        )(feed)

    private mapOrders = (feed: OrderFeed[]): Order[] => feed.map(this.mapOrder)

    private mapOrder = (feed: OrderFeed): Order => ({
        price: feed[0],
        size: feed[1],
        total: 0,
        percentOfBook: ''
    })

    private sumOrders = (side: OrderSide) => (orders: Order[]): Order[] => {
        return side === OrderSide.BID
            ? orders.reduce((acc, order, i) => {
                acc[i].total =
                    i === 0 ? order.size : acc[i - 1].total + order.size
                this.maxQuantity = Math.max(this.maxQuantity, acc[i].total)
                return acc
            }, orders)
            : orders.reduceRight((acc, order, i) => {
                acc[i].total =
                    i === acc.length - 1
                        ? order.size
                        : acc[i + 1].total + order.size
                this.maxQuantity = Math.max(this.maxQuantity, acc[i].total)
                return acc
            }, orders)
    }

    private calculatePercentOfBook = (orders: Order[]) =>
        orders.reduce((acc, order, i) => {
            acc[i].percentOfBook = round(order.total / this.maxQuantity * 100) + '%'
            return acc
        }, orders)

    private filterEmptyOrders = (orders: Order[]): Order[] =>
        orders.filter((o) => o.size > 0)

    private trimBook = (side: OrderSide) => (orders: Order[]): Order[] =>
        side === OrderSide.BID
            ? orders.slice(0, this.levelsDeep)
            : orders.slice(-this.levelsDeep)

    private upsert = (side: OrderSide) => (newOrders: Order[]): Order[] =>
        newOrders.reduce(
            (acc: Order[], order: Order) => {
                const updateIndex = _findIndex(acc, (o: Order) => o?.price === order.price)

                if (updateIndex !== -1) {
                    // Update
                    acc[updateIndex].size = order.size
                } else {
                    // Insert (while maintaining sort order)
                    const insertIndex = _sortedIndexBy(acc, order, (o: Order) => -o.price)
                    acc.splice(insertIndex, 0, order)
                }
                return acc
            },
            side === OrderSide.BID ? this.bids : this.asks
        )

    private commitOrders = (side: OrderSide) => (orders: Order[]) =>
        side === OrderSide.BID ? (this.bids = orders) : (this.asks = orders)
}
