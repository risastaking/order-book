import React from 'react'
import { AppState, ProductId } from '../types/App'
import { FeedAction, FeedActionType } from '../types/Feed'
import { OrderBookChart } from './OrderBookChart'

type OrderBookViewProps = {
  state: AppState;
};

export const OrderBookView = ({ state }: OrderBookViewProps): JSX.Element => {

    return (<>

        <div className="columns">
            <div className="column is-half ask">
                <OrderBookChart orders={state.book.asks}
                    side="ask"
                />
            </div>
            <div className="columns">
                <div className="column has-text-white">
                    Spread: {state.book.spread()} ({state.book.spreadPercent()} %)
                </div>
            </div>
            <div className="column is-half bid">
                <OrderBookChart orders={state.book.bids}
                    side="bid"
                />
            </div>
        </div>
    </>
    )
}
