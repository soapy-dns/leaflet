const Config = require('webpack-config').default;

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = new Config().merge({
    entry: {
        // app: './app/main.js'
        app: './app/index.js'
    },
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, '../dist'),
        publicPath: '/'
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                // plugins: ['lodash'],
                presets: ['react', 'es2015']
            }
        }, {
            test: /\.(png|jpg|jpeg|gif|svg)$/,
            loader: 'file-loader?limit=8192&name=assets/[name].[ext]?[hash]'
        }, {
            test: /\.(ttf|woff|woff2|eot)$/,
            loader: 'url-loader'
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './app/index.html'
        }),
        new CopyWebpackPlugin([
            {from: './app/assets', to: 'assets'}
            // { from: './server.js' }
        ])
        // new FaviconsWebpackPlugin('./app/assets/images/favicon.ico')
    ]
});
