import React from 'react'
import { AppState, ProductId } from '../types/App'
import { FeedAction, FeedActionType } from '../types/Feed'
import { OrderBookChart } from './OrderBookChart'

type OrderBookViewProps = {
  state: AppState;
};

export const OrderBookView = ({ state }: OrderBookViewProps): JSX.Element => {

    return (<>

        <h2 className="title is-size-4 has-text-white">Order Book -  {state.subscribed && <>{state.productId}</>}</h2>
        <div className="columns">
            <div className="column is-half">
                <OrderBookChart orders={state.book.asks} side="ask" />
            </div>
            <p className="has-text-white">Spread: {state.book.spread()} ({state.book.spreadPercent()} %)</p>
            <div className="column is-half">
                <OrderBookChart orders={state.book.bids} side="bid" />
            </div>
        </div>
    </>
    )
}
