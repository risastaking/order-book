import React from 'react'
import { AppState, ProductId } from '../types/App'
import { FeedAction, FeedActionType } from '../types/Feed'
import { OrderBookChart } from './OrderBookChart'

type OrderBookViewProps = {
  state: AppState;
  dispatch: React.Dispatch<FeedAction>;
};

export const OrderBookView = ({ state, dispatch }: OrderBookViewProps): JSX.Element => {
    const handleToggleFeed = () =>
        dispatch({
            type: FeedActionType.TOGGLE,
            value:
        state.productId === ProductId.ETH_USD
            ? ProductId.BTC_USD
            : ProductId.ETH_USD,
        })
    const handleReconnect = () =>
        dispatch({type: FeedActionType.SUBSCRIBE})

    if(state.subscribed === false) {
        return (
            <div>
                <button onClick={handleReconnect}>
                Reconnect to {state.productId}
                </button>
            </div>
        )
    }

    return (<>
        {state.subscribed && <p>Subscribed to {state.productId} </p>}
        <h1>Order Book</h1>
        <OrderBookChart orders={state.book.asks} maxTotal={state.book.maxTotal()} />
        <p>
        Spread: {state.book.spread()} ({state.book.spreadPercent()} %)
        </p>
        <OrderBookChart orders={state.book.bids} maxTotal={state.book.maxTotal()} />

        <input type="button" value="Toggle Feed" onClick={handleToggleFeed} />
    </>
    )
}
