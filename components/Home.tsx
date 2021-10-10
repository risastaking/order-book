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

    return <section className="section has-text-centered">
        <ReconnectModal subscribed={state.subscribed}  productId={state.productId} handleReconnect={handleReconnect} />
        <OrderBookView state={state} dispatch={dispatch} />
        <input type="button" className="button is-primary" value="Toggle Feed" onClick={handleToggleFeed} />
    </section>

}