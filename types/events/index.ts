import { Order } from '../order-book'

export interface DeltaEvent {
    asks: Order[]
    bids: Order[]
    feed: string
    product_id: string
}
export interface InfoEvent {
    event: string
    version: number
}
export interface SnapshotEvent {
    asks: Order[]
    bids: Order[]
    feed: string
    numLevels: number
    productId: string
}
export interface SubscribedEvent {
    event: string
    feed: string
    product_ids: string[]
}
