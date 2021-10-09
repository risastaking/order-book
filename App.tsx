import * as React from 'react'
import { useReducer, useEffect } from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'
import { OrderBookView } from './components/OrderBookView'
import './css/app.scss'
import { usePageVisibility } from './hooks/usePageVisibility'
import { useWebSocket } from './hooks/useWebSocket'
import { AppReducer, combineReducers, FeedReducer } from './reducers'
import { ActionType } from './reducers/AppReducer'
import {
    ActionType as FeedActionType,
    Action as FeedAction,
} from './reducers/FeedReducer'
import { AppState } from './types/App'
import { FeedEvent, ProductId } from './types/events'
import { OrderBook } from './modules/order-book/OrderBook'

const initialAppState = {
    productId: ProductId.BTC_USD,
    feed: 'book_ui_1',
    socket: null,
    info: null,
    subscribed: false,
    book: new OrderBook([], []),
} as AppState

const App = () => {
    const combinedReducer = combineReducers(AppReducer, FeedReducer)
    const [state, dispatch] = useReducer(combinedReducer, initialAppState)
    const isVisible = usePageVisibility()
    const socket = useWebSocket('wss://www.cryptofacilities.com/ws/v1', {
        onOpen: () => dispatch({ type: FeedActionType.SUBSCRIBE }),
        onMessage: (message: MessageEvent) => {
            const event = JSON.parse(message.data) as FeedEvent
            dispatch({ type: event.event || event.feed, value: event } as FeedAction)
        },
        onClose: () => console.error,
        onError: () => console.error,
    })

    useEffect(() => {
        if (isVisible) {
            dispatch({ type: ActionType.START, value: socket })
        } else {
            dispatch({ type: FeedActionType.UNSUBSCRIBE })
        }
        return () => dispatch({ type: FeedActionType.UNSUBSCRIBE })
    }, [isVisible])

    return (
        <Router>
            <div>
                <div>
                    <Link to={'/'}>Home</Link>
                    <Link to={'/apitest'}>API Test</Link>
                </div>
                <div>
                    <Switch>
                        <Route exact={true} path="/">
                            <div>Hello from generator2</div>
                        </Route>
                        <Route exact={true} path="/apitest">
                            <OrderBookView state={state} dispatch={dispatch} />
                        </Route>
                    </Switch>
                </div>
            </div>
        </Router>
    )
}

ReactDOM.render(<App />, document.getElementById('app'))
