import { WebSocketHook } from '../hooks/useWebSocket'
import { InfoEvent, ProductId } from './events'
import { OrderBook } from '../modules/order-book/OrderBook'

export interface AppState {
        productId: ProductId
        feed: string
        socket: WebSocketHook | null
        info: InfoEvent | null
        subscribed: boolean
        book: OrderBook
}
