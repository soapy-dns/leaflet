const Config = require('webpack-config').default;
const environment = require('webpack-config').environment;

console.log('---WEBPACK CONFIG - CONFIGURING ENVIRONMENT----', process.env.NODE_ENV || 'development');
environment.setAll({
    env: () => process.env.NODE_ENV || 'development'
});

module.exports = new Config().extend('config/webpack.[env].config.js');