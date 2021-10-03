import { AppState } from '../types/App'
import {
    InfoEvent,
    SubscribedEvent,
    SnapshotEvent,
    DeltaEvent,
} from '../types/events'
import { OrderBook } from '../types/order-book/OrderBook'

enum ActionType {
    INFO = 'info',
    SUBSCRIBED = 'subscribed',
    BOOK_UI_SNAPSHOT = 'book_ui_1_snapshot',
    BOOK_UI_DELTA = 'book_ui_1',
}

type Action =
    | { type: ActionType.INFO; value: InfoEvent }
    | { type: ActionType.SUBSCRIBED; value: SubscribedEvent }
    | { type: ActionType.BOOK_UI_SNAPSHOT; value: SnapshotEvent }
    | { type: ActionType.BOOK_UI_DELTA; value: DeltaEvent }

export const FeedReducer = (state: AppState, action: Action) => {
    switch (action.type) {
        case ActionType.INFO:
            return {
                ...state,
                info: action.value,
            }
        case ActionType.SUBSCRIBED:
            return {
                ...state,
                subscribed: action.value,
            }
        case ActionType.BOOK_UI_SNAPSHOT:
            let e = action.value
            return {
                ...state,
                book: new OrderBook(e.bids, e.asks),
            }
        case ActionType.BOOK_UI_DELTA:
            let d = action.value
            return {
                ...state,
                book: state?.book?.applyDeltas(d.bids, d.asks),
            }
        default:
            return state
    }
}
