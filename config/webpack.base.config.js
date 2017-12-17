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
        // creates an index.html file as specified in output.path.  This example uses template as the basis
        new HtmlWebpackPlugin({
            template: './app/index.html'
        }),
        // copies files to output root
        new CopyWebpackPlugin([
            {from: './app/assets', to: 'assets'},
            { from: './server/index.js' }
        ])
        // new FaviconsWebpackPlugin('./app/assets/images/favicon.ico')
    ]
});
