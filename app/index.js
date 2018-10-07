import React from 'react'
import ReactDom from 'react-dom'
require('es6-promise').polyfill()

// css loader
import 'normalize.css'  // I added this to get rid of the annoying blue outline around the menu button, but it didn't work
import './styles/main.css'
import 'semantic-ui-css/semantic.min.css'
import 'leaflet/dist/leaflet.css'  //
import './styles/face-styles.css'

import 'leaflet.pm/dist/leaflet.pm.css'

import Routes from './config/routes'

console.log(document.getElementById('app'))

ReactDom.render(
<Routes />,
    document.getElementById('app')
)

export default Routes
