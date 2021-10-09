export enum FeedActionType {
    SUBSCRIBE = 'subscribe',
    UNSUBSCRIBE = 'unsubscribe',
    TOGGLE = 'toggle',
    INFO = 'info',
    SUBSCRIBED = 'subscribed',
    SNAPSHOT = 'book_ui_1_snapshot',
    DELTA = 'book_ui_1',
  }

  export type FeedAction =
    | { type: FeedActionType.SUBSCRIBE }
    | { type: FeedActionType.UNSUBSCRIBE }
    | { type: FeedActionType.TOGGLE; value: ProductId }
    | { type: FeedActionType.INFO; value: InfoEvent }
    | { type: FeedActionType.SUBSCRIBED; value: SubscribedEvent }
    | { type: FeedActionType.SNAPSHOT; value: SnapshotEvent }
    | { type: FeedActionType.DELTA; value: DeltaEvent };