import React from 'react'
import { AppState, ProductId } from '../types/App'
import { FeedAction, FeedActionType } from '../types/Feed'
import { Order } from '../types/OrderBook'
import { OrderBookRow } from './OrderBookRow'

type OrderBookViewProps = {
  state: AppState;
  dispatch: React.Dispatch<FeedAction>;
};

export const OrderBookView = ({ state, dispatch }: OrderBookViewProps) => {
    const handleToggleFeed = () =>
        dispatch({
            type: FeedActionType.TOGGLE,
            value:
        state.productId === ProductId.ETH_USD
            ? ProductId.BTC_USD
            : ProductId.ETH_USD,
        })

    return (<>
        <div style={{minHeight: '40vh'}}>
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
        </div>
        <p>
        Spread: {state.book?.spread()} ({state.book?.spreadPercent()} %)
        </p>
        <div style={{minHeight: '40vh'}}>
            {state.book?.bids.map((o: Order) => (
                <OrderBookRow
                    key={o.price}
                    order={o}
                    maxTotal={state.book.maxTotal()}
                />
            ))}
        </div>
    </>
    )
}
