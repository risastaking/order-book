/* eslint-disable react/display-name */
import React from 'react'
import { AppState } from '../types/App'
import { OrderBookChart } from './OrderBookChart'
import { config } from '../config'

type OrderBookViewProps = {
  state: AppState;
};

let memo: number
let prevMemo: number
setInterval(() => {
    memo = prevMemo = Date.now()
}, config.viewRefreshInterval)
const shouldRerender = () => memo === prevMemo
const resetMemo = () => memo = Date.now()

/**
 *  OrderBookView
 *  A memoized component that limits rerenders to a set interval.
 *  This is to prevent the charts from rerendering every time we get data from
 *  the web socket. We don't want to throttle the web socket data, just the component.
 */
export const OrderBookView = React.memo(({ state }: OrderBookViewProps): JSX.Element => {
    return(
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
    )
}, (_prev, _next) => {
    // return false when the component should
    // rerender (i.e. when our interval has run)
    if (shouldRerender()) {
        resetMemo()
        return false // should rerender
    }
    return true // should NOT rerender
})
