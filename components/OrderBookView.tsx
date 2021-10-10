import React from 'react'
import { AppState } from '../types/App'
import { OrderBookChart } from './OrderBookChart'

type OrderBookViewProps = {
  state: AppState;
};

export const OrderBookView = ({ state }: OrderBookViewProps): JSX.Element =>
    <div className="columns is-gapless">
        <div className="column is-6 ask">
            <OrderBookChart orders={state.book.asks} />
        </div>
        <div className="column has-text-white is-hidden-tablet">
            <p>Spread: {state.book.spread()} ({state.book.spreadPercent()} %)</p>
        </div>
        <div className="column is-6 bid">
            <OrderBookChart orders={state.book.bids} />
        </div>
    </div>

