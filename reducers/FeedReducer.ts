import {
    InfoEvent,
    SubscribedEvent,
    SnapshotEvent,
    DeltaEvent,
} from '../types/events'
import { OrderBook } from '../types/order-book'

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
            let e = action.value as SnapshotEvent
            return {
                ...state,
                book: new OrderBook(e.bids, e.asks)
                ,
            }
        case 'book_ui_1':
            // return {
            //     ...state,
            //     book: {
            //         ...calculateBook(
            //             [
            //                 ...mergeOrders(
            //                     state.book.bids,
            //                     (action.value as DeltaEvent).bids
            //                 ),
            //             ],
            //             [
            //                 ...mergeOrders(
            //                     state.book.asks,
            //                     (action.value as DeltaEvent).asks
            //                 ),
            //             ]
            //         ),
            //     },
            // }
            return state
        default:
            return state
    }
}
