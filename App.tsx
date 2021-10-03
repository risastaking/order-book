import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'
import OrderBookView from './components/OrderBookView'
import './css/app.scss'
import { usePageVisibility } from './hooks/visibility'
import { AppState } from './types/App'
import { OrderBook } from './types/order-book/OrderBook'

const initialAppState = {
    productId: 'PI_XBTUSD',
    feed: 'book_ui_1',
    socket: null,
    info: null,
    subscribed: null,
    book: null,
} as AppState

class App extends React.Component<{}, {}> {
    render() {
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
                                <OrderBookView initialState={initialAppState} />
                            </Route>
                        </Switch>
                    </div>
                </div>
            </Router>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))
