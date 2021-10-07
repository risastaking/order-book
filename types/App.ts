import { WebSocketHook } from '../hooks/useWebSocket'
import { InfoEvent, SubscribedEvent } from './events'
import { OrderBook } from './order-book/OrderBook'

export interface AppState {
        productId: string
        feed: string
        socket: WebSocketHook | null
        info: InfoEvent | null
        subscribed: boolean
        book: OrderBook | null
}
