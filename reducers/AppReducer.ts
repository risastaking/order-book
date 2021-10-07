import React from "react";
import { useWebSocket, WebSocketHook } from "../hooks/useWebSocket";
import { AppState } from "../types/App";
import { FeedEvent } from "../types/events";
import { OrderBook } from "../types/order-book/OrderBook";
import { ActionType as FeedActionType, Action as FeedAction } from "./FeedReducer";

export enum ActionType {
    START = "start",
    STOP = "stop",
    TOGGLE_FEED = "toggle_feed"
}
export type Action =
  | { type: ActionType.START, value: WebSocketHook }
  | { type: ActionType.STOP, value: React.Dispatch<any> }
  | { type: ActionType.TOGGLE_FEED };

export const AppReducer = (state: AppState, action: Action) => {
  switch (action.type) {
    case ActionType.START:
      return {
        ...state,
        socket: action.value,
      };
    case ActionType.TOGGLE_FEED:
      //     state.socket?.send(
      //         JSON.stringify({
      //             event: 'unsubscribe',
      //             feed: state.feed,
      //             product_ids: [state.productId],
      //         }))
      //         state.socket.onopen = () =>
      //         socket.send(
      //             JSON.stringify({
      //                 event: 'subscribe',
      //                 feed: state.feed,
      //                 product_ids: [state.productId],
      //             })
      //         )
      // return {
      //     ...state,
      //     productId: 'PI_ETHUSD',
      //     book: {
      //         ...new OrderBook([], []),
      //     }
      // }
      return state;
    default:
      return state;
  }
};
