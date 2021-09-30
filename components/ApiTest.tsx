import React, { useEffect, useReducer, useRef } from 'react'
import { Order, OrderBook } from '../types/order-book'
import { combineReducers, FeedReducer, AppReducer } from '../reducers';

const initialAppState = {
    productId: 'PI_XBTUSD',
    feed: 'book_ui_1',
    socket: null,
    info: null,
    subscribed: false,
    book: new OrderBook([], [])
};

const ApiTest = () => {
    const combinedReducer = combineReducers(AppReducer, FeedReducer);
    const [state, dispatch] = useReducer(combinedReducer, initialAppState)
    const socket = useRef<any>(null);
    socket.current = state.socket

    useEffect(() => {
        dispatch({ type: 'start', value: dispatch })
        return () => dispatch({ type: 'stop', value: socket })
    }, [])
    return <div>
        <h1>Order Book</h1>
        <h2>Asks</h2>
        <table>
            <tbody>
                {state.book.asks.map((ask: Order) =>
                    <tr key={ask[0]}><td>{ask[0]}</td><td>{ask[1]}</td><td>{ask[2]}</td></tr>)}
            </tbody>
        </table>
        <h2>Bids</h2>
        <table>
            <tbody>
                {state.book.bids.map((bid: Order) =>
                    <tr key={bid[0]}><td>{bid[0]}</td><td>{bid[1]}</td><td>{bid[2]}</td></tr>)}
            </tbody>
        </table>
    </div>
}

export default ApiTest
