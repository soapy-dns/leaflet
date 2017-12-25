import React from 'react';
import ReactDom from 'react-dom';

import './styles/main.css';
import leaflet from 'leaflet'  // imports leaflet.css from leaflet npm package
import Routes from './config/routes';

require('es6-promise').polyfill();
console.log(document.getElementById('app'))

ReactDom.render(
<Routes />,
    document.getElementById('app')
);

export default Routes;
