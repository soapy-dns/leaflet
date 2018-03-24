const webpack = require('webpack');
const Config = require('webpack-config').default;

module.exports = new Config().extend('config/webpack.base.config.js').merge({
    // output: {
    //     publicPath: 'http://localhost:9001/'
    // },
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
    },
    // plugins: [
    //     new webpack.optimize.UglifyJsPlugin({
    //         compress: {
    //             warnings: true
    //         }
    //     }),
    //     // new ExtractTextPlugin('main.css')
    // ],
    // plugins: [
    //     new webpack.DefinePlugin({
    //         'process.env.NODE_ENV': '"development"',
    //         'process.env.API_URL': '"http://localhost:8081"',
    //         'process.env.GOOGLE_API_KEY': process.env.DEVELOPMENT_GOOGLE_API_KEY || '"AIzaSyDghMegcRSF-85kKMg52mwGBTAKWFxTRJ8"'
    //     })
    // ],
    devtool: 'eval'  // controls the way the source could is bundled somehow.
    // devtool: 'eval-source-map'
});
