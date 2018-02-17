const webpack = require('webpack');
const Config = require('webpack-config').default;

module.exports = new Config().extend('config/webpack.base.config.js').merge({
    module: {

        rules: [
            // allows importing of css into the file rather than having script tags in index.html
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
        // rules: [{
        //     test: /\.css$/,
        //     loader: ['style-loader', 'css-loader?importLoaders=1&sourceMap', 'postcss-loader']
        // }]
    }
    // plugins: [
    //     new webpack.optimize.UglifyJsPlugin({
    //         compress: {
    //             warnings: true
    //         }
    //     }),
    //     // new ExtractTextPlugin('main.css')
    // ]
});
