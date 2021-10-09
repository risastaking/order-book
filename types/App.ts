import { WebSocketHook } from '../hooks/useWebSocket'
import { OrderBook } from '../modules/order-book/OrderBook'
import { FeedAction } from './Feed'
import { InfoEvent } from './FeedEvents'

export interface AppConfig {
        feedURL: string
        levelsDeep: number
}

export enum ActionType {
        START = 'start',
        STOP = 'stop',
        TOGGLE = 'toggle'
}
export type Action =
        | { type: ActionType.START, value: WebSocketHook }
        | { type: ActionType.STOP, value: React.Dispatch<any> }

export enum ProductId {
        BTC_USD = 'PI_XBTUSD',
        ETH_USD = 'PI_ETHUSD',
}
export type AppAction = Action | FeedAction
export interface AppState {
        productId: ProductId
        socket: WebSocketHook | null
        info: InfoEvent | null
        subscribed: boolean
        book: OrderBook
}
