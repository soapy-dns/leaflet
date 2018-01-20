import React from 'react';
import ReactDom from 'react-dom';

import './styles/main.css';
import leaflet from 'leaflet'  // imports leaflet.css from leaflet npm package
// import 'semantic-ui-css/semantic.min.css';

// import 'jquery';
// import '/node-modules/semantic-ui-css/semantic.css';
// import 'semantic-ui-css/semantic.min.css';

import Routes from './config/routes';



require('es6-promise').polyfill();
console.log(document.getElementById('app'))

ReactDom.render(
<Routes />,
    document.getElementById('app')
);

export default Routes;
