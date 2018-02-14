import React from 'react';
import ReactDom from 'react-dom';
require('es6-promise').polyfill();

// css loader
import './styles/main.css';
import 'semantic-ui-css/semantic.min.css';
import 'leaflet/dist/leaflet.css';

import Routes from './config/routes';

console.log(document.getElementById('app'))

ReactDom.render(
<Routes />,
    document.getElementById('app')
);

export default Routes;
