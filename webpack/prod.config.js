const path = require('path');
const webpack = require('webpack');

const customPath = path.join(__dirname, './customPublicPath');

module.exports = {
    entry: {
        background: [customPath, path.join(__dirname, '../chrome/extension/background')],
        inject: [customPath, path.join(__dirname, '../chrome/extension/inject')]
    },
    output: {
        path: path.join(__dirname, '../build/js'),
        filename: '[name].bundle.js',
        chunkFilename: '[id].chunk.js'
    },
    plugins: [
        new webpack.IgnorePlugin(/[^/]+\/[\S]+.dev$/),
        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            compressor: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            loaders: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        sourceMap: true,
                        localIdentName: '[path][name]__[local]--[hash:base64:5]'
                    }
                }
                // 'postcss-loader'
            ]
        }, {
            test: /\.png$/,
            loader: 'url-loader'
        }]
    }
};
