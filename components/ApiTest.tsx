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
        <table>
        {book.asks.map((ask: Order) => <tr><td>{ask[0]}</td><td>{ask[1]}</td><td>{ask[2]}</td></tr>)}
        </table>
        <h2>Bids</h2>
        <table>
        {book.bids.map((bid: Order) => <tr><td>{bid[0]}</td><td>{bid[1]}</td><td>{bid[2]}</td></tr>)}
        </table>
    </div>
}

export default ApiTest