import { ActionType } from '../../reducers/FeedReducer';
import { Order, OrderFeed } from '../order-book/OrderBook'

export interface FeedEvent {
    event: ActionType
    feed: string
    product_ids: string[]
}

export interface DeltaEvent {
    asks: OrderFeed[]
    bids: OrderFeed[]
    feed: string
    product_id: string
}
export interface InfoEvent {
    event: string
    version: number
}
export interface SnapshotEvent {
    asks: OrderFeed[]
    bids: OrderFeed[]
    feed: string
    numLevels: number
    productId: string
}
export interface SubscribedEvent {
    event: ActionType
    feed: string
    product_ids: string[]
}
