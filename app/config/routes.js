import React, {Component} from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import NotFound from '../views/404';
import Splash from '../views/splash';
// import config from './index';
import Main from '../components/main';
import Map from '../components/map/index';

class Routes extends Component {

    constructor(props) {
        super(props);
        // this.state = {
        //     rehydrated: false
        // };

        // this.secureRoute = this.secureRoute.bind(this);
    }

    componentWillMount() {
        console.log('will mount')
    }


    render() {
        // todo persistance so that refresh keeps the state, security if any
        return (
            <Router history={browserHistory} onUpdate={() => window.scrollTo(0, 0)}>
                <Route path="/" component={Main}>
                    <IndexRoute component={Map}/>
                </Route>
                <Route path="splash" component={Splash}/>
                <Route path="*" component={NotFound}/>
            </Router>
        );
    }
}

export default Routes;
