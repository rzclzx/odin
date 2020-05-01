 var path = require('path');
 var webpack = require("webpack");
 var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
 var HtmlWebpackPlugin = require('html-webpack-plugin');
 module.exports = {
     entry: './app/entry.ts',
     output: {
         path: __dirname + '/dist',
         filename: "bundle.js"
     },
     module: {
    rules: [
         {
            test: /\.tsx?$/,
            loaders: ['ts-loader'],
            exclude: /node_modules/,
         },
         {
            test: /\.html$/,
            loader: 'html-loader'
         },
         {
            test: /^.*[^My].less$/,
            loaders: ['style-loader','css-loader','less-loader']
         },
         {
            test: /\My.less$/,
            loaders: ['css-to-string-loader','css-loader','less-loader']
         },
         {
            test: /\.(png|jpe?g|gif|ico|xlsx)(\?\S*)?$/,
            loader: 'file-loader'
         },
         {
            test: /\.mp4$/,
            loader: 'file-loader'
         },
         { test: /\.css$/, loaders: ['style-loader','css-loader'] },
         { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file-loader" },
         { test: /\.(woff|woff2)$/, loader:"url-loader?prefix=font/&limit=5000" },
         { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/octet-stream" },
         { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=image/svg+xml" }
     ]
    },
    resolve: {
       extensions: [".tsx", ".ts", ".js"]
    },
    plugins: [
        new BrowserSyncPlugin(),
        new webpack.ProvidePlugin({
            $:"jquery",
            jQuery:"jquery",
            "window.jQuery":"jquery"
        }),
        new HtmlWebpackPlugin({
            inject: false,
            template: 'index.html',
            favicon: './app/images/favicon.ico'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false,
            }
        })
    ],
    devServer: {
        contentBase: path.join(__dirname + "/dist"),
        publicPath: '/',
        compress: true,
        hot: true
    }
 };