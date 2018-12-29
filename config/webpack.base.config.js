const Config = require('webpack-config').default;

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack')


module.exports = new Config().merge({

    // takes the index.js file, and all its dependencies and creates one uber file
    // called bundle.js in the /dist folder
    entry: {
        // app: './app/main.js'
        app: './app/index.js'
    },
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, '../dist'),
        publicPath: '/'
    },

    // use loaders to do stuff with non js files
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                // loader: 'babel-loader',
                loader: 'babel-loader?cacheDirectory=true',  // this is supposed to cache files and make the build faster - i didn't notice a difference
                // loader: 'babel',
                options: {
                    plugins: ['lodash'],  // this is supposed to pull out only the functionality required - I can't get it to work.
                    presets: ['react', 'es2015']
                }
            },

            {
                // test: /\.(png|jpg|jpeg|gif)$/,
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                loader: 'file-loader?limit=8192&name=assets/[name].[ext]?[hash]'
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                loader: 'url-loader'
            }
            // {
            //     // css-loader interprets @import and url() like import/require()
            //     test: /\.css$/,
            //     // loader: 'css-loader'
            //     loader: ['style-loader', 'css-loader']
            //
            // }
        ]
    },
    plugins: [
        // creates an index.html file as specified in output.path.  This example uses template as the basis
        new HtmlWebpackPlugin({
            template: './app/index.html'
        }),
        // copies files to output root
        new CopyWebpackPlugin([
            {from: './app/assets', to: 'assets'},
            // {from: './app/styles', to: 'styles'},
            {from: './server.js'}
        ]),
        // new FaviconsWebpackPlugin('./app/assets/images/map.png'),
        // new BundleAnalyzerPlugin(),  // uncomment this to analyse the bundle
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)  //ignore webpack locals - not interested here




    ]
});
