import React, { useEffect, useState } from 'react'
import OrderBookService from '../services/OrderBookService'
import { Order, OrderBook } from '../types/order-book'

const ApiTest = () => {
    let [book, setBook] = useState(new OrderBook([],[]))
    let obs = new OrderBookService(setBook)
    useEffect(() => {
        obs.start()

        return () => {
            obs.stop()
        }
    }, [])
    return <div>
        <h1>Order Book</h1>
        <h2>Asks</h2>
        {book.asks.map((ask: Order) => <div>{ask[0]} {ask[1]}</div>)}
        <h2>Bids</h2>
        {book.bids.map((bid: Order) => <div>{bid[0]} {bid[1]}</div>)}
    </div>
}

export default ApiTest