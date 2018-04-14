import React, {Component} from 'react'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'
import { createStore, compose, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { persistStore, autoRehydrate } from 'redux-persist'
// import { asyncLocalStorage } from 'redux-persist/storages'
import thunk from 'redux-thunk'
import reducer from '../reducers/index'
import TestContainer from '../components/test-container'

import NotFound from '../views/404'
import Splash from '../views/splash'
import Main from '../components/main'
import Map from '../components/map'
// import Map from '../components/mapbox'
// import Collections from '../components/collections/collections'

const store = createStore(reducer, compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
), autoRehydrate())

class Routes extends Component {

    constructor(props) {
        super(props)
        this.state = {
            rehydrated: false
        }

        // this.secureRoute = this.secureRoute.bind(this)
    }

    componentWillMount() {
        // defaults to localStorage
        persistStore(store, { }, () => {
            this.setState({ rehydrated: true })
        })
    }

    // render() {
    //     if (this.state.rehydrated) {
    //         return (
    //             <Provider store={store}>
    //                 <Router history={browserHistory} onUpdate={() => window.scrollTo(0, 0)}>
    //                     <Route path="/" component={Main}>
    //                         <IndexRoute component={TestContainer}/>
    //                     </Route>
    //                     <Route path="splash" component={Splash}/>
    //                     <Route path="*" component={NotFound}/>
    //                 </Router>
    //             </Provider>
    //         )
    //     }
    //     return <div />
    // }
    render() {
        if (this.state.rehydrated) {
            return (
                <Provider store={store}>
                    <Router history={browserHistory} onUpdate={() => window.scrollTo(0, 0)}>
                        <Route path="/" component={Main}>
                            <IndexRoute component={Map}/>
                            <Route path="files" component={TestContainer} />

                        </Route>
                        <Route path="files" component={TestContainer} />
                        <Route path="splash" component={Splash}/>
                        <Route path="*" component={NotFound}/>
                    </Router>
                </Provider>
            )
        }
        return <div />
    }
}

export default Routes
