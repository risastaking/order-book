import {
    InfoEvent,
    SubscribedEvent,
    SnapshotEvent,
    DeltaEvent,
} from '../types/events'
import { Order } from '../types/order-book'

const asc = (a: number[], b: number[]) => a[0] - b[0]
const desc = (a: number[], b: number[]) => b[0] - a[0]

const mergeOrders = (orders: Order[], newOrders: Order[]): Order[] => {
    let merged = orders.map((o) => [o[0], o[1], o[2]] as Order)
    newOrders.forEach((n) => {
        let index = merged.findIndex((o) => o[0] === n[0])
        if (index === -1) {
            merged.push(n)
        } else {
            merged[index][1] = n[1]
        }
    })
    return merged
}

const filterZeroQuantityOrders = (orders: Order[]) => {
    let zeroQuantity = orders.filter((o) => o[1] === 0)
    return orders.filter((o) => !zeroQuantity.map((z) => z[0]).includes(o[0]))
}

const calculateBook = (bids: Order[], asks: Order[]) => {
    bids = filterZeroQuantityOrders(bids)
    asks = filterZeroQuantityOrders(asks)

    bids.sort(desc)
    bids = sumOrders(bids)
    bids = bids.slice(0, 25)

    asks.sort(asc)
    asks = sumOrders(asks)
    asks = asks.slice(0, 25)
    asks.sort(desc)

    return { bids: bids, asks: asks }
}
const sumOrders = (orders: Order[]) =>
    orders?.reduce((acc: Order[], current: Order) => {
        const last: Order = acc.length > 0 ? acc[acc.length - 1] : [0, 0, 0]
        const newOrder: Order = [current[0], current[1], last[2] + current[1]]
        return [...acc, newOrder]
    }, [] as Order[])

export const FeedReducer = (state: any, action: any) => {
    switch (action.type) {
        case 'info':
            return {
                ...state,
                info: action.value as InfoEvent,
            }
        case 'subscribed':
            return {
                ...state,
                subscribed: action.value as SubscribedEvent,
            }
        case 'book_ui_1_snapshot':
            let m = action.value as SnapshotEvent
            return {
                ...state,
                book: {
                    ...calculateBook([...m.bids], [...m.asks]),
                },
            }
        case 'book_ui_1':
            return {
                ...state,
                book: {
                    ...calculateBook(
                        [
                            ...mergeOrders(
                                state.book.bids,
                                (action.value as DeltaEvent).bids
                            ),
                        ],
                        [
                            ...mergeOrders(
                                state.book.asks,
                                (action.value as DeltaEvent).asks
                            ),
                        ]
                    ),
                },
            }
        default:
            return state
    }
}
