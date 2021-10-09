import { WebSocketHook } from '../hooks/useWebSocket'
import { InfoEvent, ProductId } from './events'
import { OrderBook } from '../modules/order-book/OrderBook'
import { Action } from '../reducers/AppReducer'
import { FeedAction } from '../reducers/FeedReducer'

export enum ProductId {
        BTC_USD = 'PI_XBTUSD',
        ETH_USD = 'PI_ETHUSD',
    }


export type AppAction = Action | FeedAction
export interface AppState {
        productId: ProductId
        feed: string
        socket: WebSocketHook | null
        info: InfoEvent | null
        subscribed: boolean
        book: OrderBook
}
