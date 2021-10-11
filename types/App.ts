import { WebSocketHook } from '../hooks/useWebSocket'
import { OrderBook } from '../modules/order-book/OrderBook'
import { FeedAction, FeedActionType } from './Feed'
import { InfoEvent } from './FeedEvents'

export interface AppConfig {
        feedURL: string
        levelsDeep: number
        viewRefreshInterval: number
}

export enum AppActionType {
        START = 'start',
        STOP = 'stop',
        TOGGLE = 'toggle'
}
export type Action =
        | { type: AppActionType.START, value: WebSocketHook }
        | { type: AppActionType.STOP, value: React.Dispatch<any> }

export enum ProductId {
        BTC_USD = 'PI_XBTUSD',
        ETH_USD = 'PI_ETHUSD',
}
export type AppAction = Action | FeedAction
export interface AppState {
        feed: FeedActionType
        productId: ProductId
        socket: WebSocketHook | null
        info: InfoEvent | null
        subscribed: boolean | null
        book: OrderBook
}
