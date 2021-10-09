import React from 'react'
import { Order } from '../modules/order-book/OrderBook'
import { AppState } from '../types/App'
import { ActionType, Action } from '../reducers/FeedReducer'
import { ProductId } from '../types/events'
import { OrderBookRow } from './OrderBookRow'

type OrderBookViewProps = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
};

export const OrderBookView = ({ state, dispatch }: OrderBookViewProps) => {
    const handleToggleFeed = () =>
        dispatch({
            type: ActionType.TOGGLE,
            value:
        state.productId === ProductId.ETH_USD
            ? ProductId.BTC_USD
            : ProductId.ETH_USD,
        })

    return (
        <div>
            {state.subscribed && <p>Subscribed to {state.productId} </p>}
            <input type="button" value="Toggle Feed" onClick={handleToggleFeed} />
            <h1>Order Book</h1>
            {state.book?.asks.map((o: Order) => (
                <OrderBookRow
                    key={o.price}
                    order={o}
                    maxTotal={state.book.maxTotal()}
                />
            ))}
            <p>
        Spread: {state.book?.spread()} ({state.book?.spreadPercent()} %)
            </p>
            {state.book?.bids.map((o: Order) => (
                <OrderBookRow
                    key={o.price}
                    order={o}
                    maxTotal={state.book.maxTotal()}
                />
            ))}
        </div>
    )
}
