/* eslint-disable react/display-name */
import React from 'react'
import { config } from '../config'
import { AppState, ProductId } from '../types/App'
import { FeedAction, FeedActionType } from '../types/Feed'
import { OrderBookView } from './OrderBookView'
import { ReconnectModal } from './ReconnectModal'

type HomeProps = {
    state: AppState;
    dispatch: React.Dispatch<FeedAction>;
  };

let memo: number
let prevMemo: number
setInterval(() => {
    memo = prevMemo = Date.now()
}, config.viewRefreshInterval)
const shouldRerender = () => memo === prevMemo
const resetMemo = () => memo = Date.now()

/**
 *  Home
 *  A memoized component that limits rerenders to a set interval.
 *  This is to prevent the charts from rerendering every time we get data from
 *  the web socket. We don't want to throttle the web socket data, just the component.
 */
export const Home = React.memo(({ state, dispatch }: HomeProps) => {
    const handleToggleFeed = () =>
        dispatch({
            type: FeedActionType.TOGGLE,
            value:
    state.productId === ProductId.ETH_USD
        ? ProductId.BTC_USD
        : ProductId.ETH_USD,
        })
    const handleReconnect = () => dispatch({type: FeedActionType.SUBSCRIBE})

    return <div id="home">
        <ReconnectModal subscribed={state.subscribed}  productId={state.productId} handleReconnect={handleReconnect} />
        <h2>Order Book -  {state.subscribed && <>{state.productId}</>}</h2>
        <p className="is-hidden-mobile">Spread: {state.book.spread()} ({state.book.spreadPercent()} %)</p>
        <OrderBookView state={state} />
        <p><input type="button" className="button is-primary" value="Toggle Feed" onClick={handleToggleFeed} /></p>
    </div>

}, (_prev, _next) => {
    // return false when the component should
    // rerender (i.e. when our interval has run)
    if (shouldRerender()) {
        resetMemo()
        return false // should rerender
    }
    return true // should NOT rerender
})
