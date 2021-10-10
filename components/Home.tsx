import React from 'react'
import { AppState, ProductId } from '../types/App'
import { FeedAction, FeedActionType } from '../types/Feed'
import { OrderBookView } from './OrderBookView'
import { ReconnectModal } from './ReconnectModal'

type HomeProps = {
    state: AppState;
    dispatch: React.Dispatch<FeedAction>;
  };

export const Home = ({ state, dispatch }: HomeProps) => {
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

}