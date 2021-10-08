import { WebSocketHook } from '../hooks/useWebSocket'
import { InfoEvent, ProductId, SubscribedEvent } from './events'
import { OrderBook } from './order-book/OrderBook'

export interface AppState {
        productId: ProductId
        feed: string
        socket: WebSocketHook | null
        info: InfoEvent | null
        subscribed: boolean
        book: OrderBook | null
}
