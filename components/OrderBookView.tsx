import React, { useEffect, useReducer, useRef } from "react";
import { Order } from "../types/order-book/OrderBook";
import { combineReducers, FeedReducer, AppReducer } from "../reducers";
import { AppState } from "../types/App";
import { usePageVisibility } from "../hooks/usePageVisibility";
import { ActionType, Action } from "../reducers/FeedReducer";
import { ProductId } from "../types/events";

type OrderBookViewProps = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
};

export const OrderBookView = ({ state, dispatch }:OrderBookViewProps) => {
  return (
    <div>
      {state.subscribed && <p>Subscribed to {state.productId} </p>}
      <input
        type="button"
        value="Toggle Feed"
        onClick={() => dispatch({ type: ActionType.TOGGLE, value: state.productId === ProductId.ETH_USD ? ProductId.BTC_USD : ProductId.ETH_USD })}
      />
      <h1>Order Book</h1>
      <h2>Asks</h2>
      <table>
        <tbody>
          {state.book?.asks.map((o: Order) => (
            <tr key={o.price}>
              <td>{o.price}</td>
              <td>{o.size}</td>
              <td>{o.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        Spread: {state.book?.spread()} ({state.book?.spreadPercent()} %)
      </p>
      <h2>Bids</h2>
      <table>
        <tbody>
          {state.book?.bids.map((o: Order) => (
            <tr key={o.price}>
              <td>{o.price}</td>
              <td>{o.size}</td>
              <td>{o.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


