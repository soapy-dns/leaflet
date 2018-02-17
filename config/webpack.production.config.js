const webpack = require('webpack');
const Config = require('webpack-config').default;
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = new Config().extend('config/webpack.base.config.js').merge({
    module: {

    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true
            }
        }),
        // new ExtractTextPlugin('main.css')
    ]
});
