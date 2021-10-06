import React, { useEffect, useReducer, useRef } from 'react'
import { Order } from '../types/order-book/OrderBook'
import { combineReducers, FeedReducer, AppReducer } from '../reducers'
import { AppState } from '../types/App'
import { usePageVisibility } from '../hooks/visibility'
import { ActionType } from '../reducers/AppReducer'

type OrderBookViewProps = {
    initialState: AppState
}

const OrderBookView = ({ initialState }: OrderBookViewProps) => {
    //TODO: move to app level, should only have dispatch here
    const combinedReducer = combineReducers(AppReducer, FeedReducer)
    const [state, dispatch] = useReducer(combinedReducer, initialState)
    const isVisible = usePageVisibility()

    useEffect(() => {
        if (isVisible) {
            dispatch({ type: ActionType.START, value: dispatch })
        } else {
            dispatch({ type: ActionType.STOP})
        }
        return () => dispatch({ type: ActionType.STOP})
    }, [isVisible])
    return (
        <div>
            {state.subscribed && <p>Subscribed to {state.productId} </p>}
            <h1>Order Book</h1>
            <h2>Asks</h2>
            <table>
                <tbody>
                    {state.book?.asks.map((o: Order) => (
                        <tr key={o.price}>
                            <td>{o.price}</td>
                            <td>{o.size}</td>
                            <td>{o.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p>
                Spread: {state.book?.spread()} ({state.book?.spreadPercent()} %)
            </p>
            <h2>Bids</h2>
            <table>
                <tbody>
                    {state.book?.bids.map((o: Order) => (
                        <tr key={o.price}>
                            <td>{o.price}</td>
                            <td>{o.size}</td>
                            <td>{o.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default OrderBookView
