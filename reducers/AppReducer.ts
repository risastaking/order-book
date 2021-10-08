import React from "react";
import { useWebSocket, WebSocketHook } from "../hooks/useWebSocket";
import { AppState } from "../types/App";
import { FeedEvent } from "../types/events";
import { OrderBook } from "../types/order-book/OrderBook";
import { ActionType as FeedActionType, Action as FeedAction } from "./FeedReducer";


export enum ActionType {
  START = "start",
  STOP = "stop",
  TOGGLE = "TOGGLE"
}
export type Action =
  | { type: ActionType.START, value: WebSocketHook }
  | { type: ActionType.STOP, value: React.Dispatch<any> }

export const AppReducer = (state: AppState, action: Action | FeedAction) => {
  switch (action.type) {
    case ActionType.START:
      return {
        ...state,
        socket: action.value,
      };
    default:
      return state;
  }
};
