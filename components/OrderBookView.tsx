import React, { useEffect, useReducer, useRef } from 'react'
import { Order } from '../types/order-book'
import { combineReducers, FeedReducer, AppReducer } from '../reducers';
import { AppState } from '../types/App';


const OrderBookView = ({ initialState }: AppState) => {

    //TODO: move to app level, should only have dispatch here
    const combinedReducer = combineReducers(AppReducer, FeedReducer);
    const [state, dispatch] = useReducer(combinedReducer, initialState)
    const socket = useRef<any>(null);
    socket.current = state.socket

    useEffect(() => {
        dispatch({ type: 'start', value: dispatch })
        return () => dispatch({ type: 'stop', value: socket })
    }, [])
    return <div>
        {state.subscribed && <p>Subscribed to {state.productId} </p>}
        <h1>Order Book</h1>
        <h2>Asks</h2>
        <table>
            <tbody>
                {state.book?.asks.map((ask: Order) =>
                    <tr key={ask[0]}><td>{ask[0]}</td><td>{ask[1]}</td><td>{ask[2]}</td></tr>)}
            </tbody>
        </table>
        <h2>Bids</h2>
        <table>
            <tbody>
                {state.book?.bids.map((bid: Order) =>
                    <tr key={bid[0]}><td>{bid[0]}</td><td>{bid[1]}</td><td>{bid[2]}</td></tr>)}
            </tbody>
        </table>
    </div >
}

export default OrderBookView
