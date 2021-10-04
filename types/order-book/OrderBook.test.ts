import { OrderBook, OrderFeed } from './OrderBook'

let asks: OrderFeed[] = [
    [30000, 200],
    [21000, 200],
]
let bids: OrderFeed[] = [
    [20000, 150],
    [15000, 150],
]

test('snapshot', () => {
    let actual = new OrderBook(bids, asks)
    expect(actual).toMatchSnapshot()
})
test('totals are sorted properly', () => {
    let actual = new OrderBook(bids, asks)
    actual.processFeed([[1, 100]], [[50000, 100]])

    expect(actual.bids.map((b) => b.total)).toStrictEqual([150, 300, 400])
    expect(actual.asks.map((b) => b.total)).toStrictEqual([500, 400, 200])
})
test('prices are sorted properly', () => {
    let actual = new OrderBook(bids, asks)
    actual.processFeed([[10000, 100]], [[50000, 100]])

    expect(actual.bids.map((b) => b.price)).toStrictEqual([20000, 15000, 10000])
    expect(actual.asks.map((b) => b.price)).toStrictEqual([50000, 30000, 21000])
})
test('spread', () => {
    let actual = new OrderBook(bids, asks)
    expect(actual.spread()).toBe(1000)
})
test('spread percent', () => {
    let actual = new OrderBook(bids, asks)
    actual.processFeed([[20502.5, 1000]], [])
    expect(actual.spreadPercent()).toBe(1.59)
})
test('apply deltas unordered', () => {
    let asks: OrderFeed[] = [
        [47274, 200],
        [47363.5, 200],
    ]
    let bids: OrderFeed[] = [
        [47258.5, 150],
        [47224.5, 150],
    ]
    let askDeltas: OrderFeed[] = [
        [47274, 0],
        [47275, 10],
        [47362, 25],
        [47363.5, 700],
    ]

    let bidDeltas: OrderFeed[] = [
        [47225.5, 100],
        [47258.5, 0],
        [47268.5, 10],
        [47224.5, 100],
    ]
    let actual = new OrderBook(bids, asks)
    actual.processFeed(bidDeltas, askDeltas)

    expect(actual.bids.reduce((acc, curr) => acc + curr.size, 0)).toBe(210)
    expect(actual.asks.reduce((acc, curr) => acc + curr.size, 0)).toBe(735)
    expect(actual.bids.map((b) => b.price)).toStrictEqual([
        47268.5, 47225.5, 47224.5,
    ])
    expect(actual.asks.map((b) => b.price)).toStrictEqual([
        47363.5, 47362, 47275,
    ])
})

test('empty deltas', () => {
    let actual = new OrderBook(bids, asks)
    actual = actual.processFeed([], [])

    expect(actual.bids.length).toBe(bids.length)
    expect(actual.asks.length).toBe(asks.length)
})

test('levels deep 1', () => {
    let book = new OrderBook(bids, asks)
    book.levelsDeep = 1

    book.processFeed(
        [
            [40000, 100],
            [40000, 200],
        ],
        []
    )
    book.processFeed(
        [[40000, 200]],
        [
            [50000, 200],
            [50001, 0],
        ]
    )

    expect(book.bids.length).toBe(1)
    expect(book.asks.length).toBe(1)
})
test('levels deep 2', () => {
    let book = new OrderBook(bids, asks)
    book.levelsDeep = 2

    book.processFeed(
        [
            [40000, 100],
            [40000, 200],
        ],
        []
    )
    book.processFeed(
        [[40000, 200]],
        [
            [50000, 200],
            [50001, 0],
        ]
    )

    expect(book.bids.length).toBe(2)
    expect(book.asks.length).toBe(2)
})
