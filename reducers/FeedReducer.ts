import { AppState } from "../types/App";
import {
  InfoEvent,
  SubscribedEvent,
  SnapshotEvent,
  DeltaEvent,
} from "../types/events";
import { OrderBook } from "../types/order-book/OrderBook";

export enum ActionType {
  SUBSCRIBE = "subscribe",
  INFO = "info",
  UNSUBSCRIBE = "unsubscribe",
  SUBSCRIBED = "subscribed",
  SNAPSHOT = "book_ui_1_snapshot",
  DELTA = "book_ui_1",
}

export type Action =
  | { type: ActionType.SUBSCRIBE }
  | { type: ActionType.UNSUBSCRIBE }
  | { type: ActionType.INFO; value: InfoEvent }
  | { type: ActionType.SUBSCRIBED; value: SubscribedEvent }
  | { type: ActionType.SNAPSHOT; value: SnapshotEvent }
  | { type: ActionType.DELTA; value: DeltaEvent };

export const FeedReducer = (state: AppState, action: Action) => {
  switch (action.type) {
    case ActionType.INFO:
      return {
        ...state,
        info: action.value,
      };
    case ActionType.SUBSCRIBE:
      state.socket?.sendJson({
          event: ActionType.SUBSCRIBE,
          feed: state.feed,
          product_ids: [state.productId]
        });
        return state
      case ActionType.UNSUBSCRIBE:
        state.socket?.sendJson({
            event: ActionType.UNSUBSCRIBE,
            feed: state.feed,
            product_ids: [state.productId],
          })
          return {
            ...state,
            subscribed: false,
          };
    case ActionType.SUBSCRIBED:
      return {
        ...state,
        subscribed: true,
      };
    case ActionType.SNAPSHOT:
      return {
        ...state,
        book: new OrderBook(action.value.bids, action.value.asks),
      };
    case ActionType.DELTA:
      return {
        ...state,
        book: state?.book?.processFeed(action.value.bids, action.value.asks),
      };
    default:
      return state;
  }
};
