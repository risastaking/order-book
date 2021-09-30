import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import ApiTest from './components/ApiTest';
import './css/app.scss';

class App extends React.Component<{}, {}> {
    render() {
        return (
            <Router>
                <div>
                    <div>
                        <Link to={'/'}>
                            Home
                        </Link>
                        <Link to={'/apitest'}>
                            API Test
                        </Link>
                    </div>
                    <div>
                        <Switch>
                            <Route exact={true} path="/">
                                <div>Hello from generator2</div>
                            </Route>
                            <Route exact={true} path="/apitest">
                                <ApiTest/>
                            </Route>
                        </Switch>
                    </div>
                </div>
            </Router>

        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
