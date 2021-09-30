export interface DeltaEvent {
    asks: Array<Array<number>>;
    bids: Array<Array<number>>;
    feed: string;
    product_id: string;
}
export interface InfoEvent {
    event: string;
    version: number;
}
export interface SnapshotEvent {
    asks: Array<Array<number>>;
    bids: Array<Array<number>>;
    feed: string;
    numLevels: number;
    productId: string;
}
export interface SubscribedEvent {
    event: string;
    feed: string;
    product_ids: string[];
}