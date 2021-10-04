import { OrderBook, OrderFeed } from './OrderBook'

let asks: OrderFeed[] = [
    [47274, 200],
    [47363.5, 200],
]
let bids: OrderFeed[] = [
    [47258.5, 150],
    [47224.5, 150],
]

test('snapshot', () => {
    let actual = new OrderBook(bids, asks)
    expect(actual.bids.reduce((acc, curr) => acc + curr.size, 0)).toBe(300)
    expect(actual.asks.reduce((acc, curr) => acc + curr.size, 0)).toBe(400)
})
test('spread quantity', () => {
    let actual = new OrderBook(bids, asks)
    expect(actual.spread()).toBe(105)
})
test('spread percent', () => {
    let actual = new OrderBook(bids, asks)
    expect(actual.spreadPercent()).toBe(0.22)
})
test('apply deltas ', () => {
    let asks: OrderFeed[] = [
        [47274, 200],
        [47363.5, 200],
    ]
    let askDeltas: OrderFeed[] = [
        [47274, 0],
        [47363.5, 700],
        [47362, 25],
    ]
    let bids: OrderFeed[] = [
        [47258.5, 150],
        [47224.5, 150],
    ]

    let bidDeltas: OrderFeed[] = [
        [47258.5, 0],
        [47224.5, 100],
    ]
    let actual = new OrderBook(bids, asks)
    actual = actual.processFeed(bidDeltas, askDeltas)
    expect(actual.bids.reduce((acc, curr) => acc + curr.size, 0)).toBe(100)
    expect(actual.asks.reduce((acc, curr) => acc + curr.size, 0)).toBe(725)
})

test('empty deltas', () => {
    let actual = new OrderBook(bids, asks)
    actual = actual.processFeed([], [])
})

test('levels deep', () => {
    let book = new OrderBook(bids, asks)
    book.levelsDeep = 1

    let actual = book.processFeed([[50000, 100]], [])

    expect(actual.bids.length).toBe(1)
    expect(actual.asks.length).toBe(1)
})
