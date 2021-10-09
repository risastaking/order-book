import { AppAction, AppState } from '../types/App'
import { OrderBook } from '../modules/order-book/OrderBook'
import { FeedActionType } from '../types/Feed'

export const FeedReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
    case FeedActionType.INFO:
        return {
            ...state,
            info: action.value,
        }
    case FeedActionType.SUBSCRIBE:
        state.socket?.sendJson({
            event: FeedActionType.SUBSCRIBE,
            product_ids: [state.productId],
        })
        return state
    case FeedActionType.UNSUBSCRIBE:
        state.socket?.sendJson({
            event: FeedActionType.UNSUBSCRIBE,
            product_ids: [state.productId],
        })
        return {
            ...state,
            subscribed: false,
        }
    case FeedActionType.TOGGLE:
        state.socket?.sendJson({
            event: FeedActionType.UNSUBSCRIBE,
            product_ids: [state.productId],
        })
        state.socket?.sendJson({
            event: FeedActionType.SUBSCRIBE,
            product_ids: [action.value],
        })
        return {
            ...state,
            productId: action.value,
            subscribed: false,
        }
    case FeedActionType.SUBSCRIBED:
        return {
            ...state,
            subscribed: true,
        }
    case FeedActionType.SNAPSHOT:
        return {
            ...state,
            book: new OrderBook(action.value.bids, action.value.asks),
        }
    case FeedActionType.DELTA:
        return {
            ...state,
            book: state.book.processFeed(action.value.bids, action.value.asks),
        }
    default:
        return state
    }
}
