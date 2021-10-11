import React, { useReducer, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { usePageVisibility } from './hooks/usePageVisibility'
import { useWebSocket } from './hooks/useWebSocket'
import { AppReducer, combineReducers, FeedReducer } from './reducers'
import { AppActionType, AppState, ProductId } from './types/App'
import { OrderBook } from './modules/order-book/OrderBook'
import { FeedActionType, FeedAction } from './types/Feed'
import { FeedEvent } from './types/FeedEvents'
import { config } from './config'
import { Home } from './components/Home'
import 'bulma/css/bulma.css'
import './css/app.scss'

const initialAppState = {
    productId: ProductId.BTC_USD,
    feed: FeedActionType.DELTA,
    book: new OrderBook([], []),
} as AppState

const App = () => {
    const combinedReducer = combineReducers(AppReducer, FeedReducer)
    const [state, dispatch] = useReducer(combinedReducer, initialAppState)
    const isVisible = usePageVisibility()
    const socket = useWebSocket(config.feedURL, {
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
            dispatch({ type: AppActionType.START, value: socket })
        } else {
            dispatch({ type: FeedActionType.UNSUBSCRIBE })
        }
        return () => dispatch({ type: FeedActionType.UNSUBSCRIBE })
    }, [isVisible])

    return (
        <Router>
            <Switch>
                <Route path="/">
                    <Home state={state} dispatch={dispatch} />
                </Route>
            </Switch>
        </Router>
    )
}

ReactDOM.render(<App />, document.getElementById('app'))
