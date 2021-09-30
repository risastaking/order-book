import { InfoEvent, SubscribedEvent, SnapshotEvent } from "../types/events"
import { OrderBook } from "../types/order-book"

export const FeedReducer = (state: any, action: any) => {
    switch (action.type) {
        case 'info':
            return {
                ...state,
                info: action.value as InfoEvent
            }
        case 'subscribed':
            return {
                ...state,
                subscribed: action.value as SubscribedEvent
            }
        case 'book_ui_1_snapshot':
            let m = action.value as SnapshotEvent
            let book = new OrderBook(m.bids, m.asks)
            book.calculateTotals()
            return {
                ...state,
                book: book
            }
        case 'book_ui_1':
            //TODO: implement
            //return action.value as DeltaEvent
            return state
        default:
            console.error('Feed: Unknown message type ' + action.type)
            return state
    }
}