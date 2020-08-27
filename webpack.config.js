const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const GIPHY_API = process.env.GIPHY_API || '';

const DIST_DIR = path.resolve(__dirname, 'dist');
const SRC_DIR = path.resolve(__dirname, 'src');
const ASSET_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'eot', 'otf', 'svg', 'ttf', 'woff', 'woff2'];


module.exports = {
    entry: {
        background: path.join(SRC_DIR, 'background', 'background.js'),
        entry: path.join(SRC_DIR, 'inject', 'entry.js')
    },
    output: {
        path: DIST_DIR,
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            sourceMap: false
                        }
                    }
                ]
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                ]
            },
            {
                test: new RegExp(`\.(${ASSET_EXTENSIONS.join('|')})$`),
                exclude: /app/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]'
                    }
                }
            },
            {
                test: new RegExp(`\.(${ASSET_EXTENSIONS.join('|')})$`),
                exclude: /(icon|screenshots)/,
                use: {
                    loader: 'url-loader',
                }
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            GIPHY_API: JSON.stringify(GIPHY_API),
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src/manifest.json',
                    transform: (content) => (
                        Buffer.from(JSON.stringify({
                            description: process.env.npm_package_description,
                            version: process.env.npm_package_version,
                            ...JSON.parse(content.toString())
                        }))
                    )
                },
                {
                    from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js'
                }
            ]
        }),
        new HtmlWebpackPlugin({
            template: path.join(SRC_DIR, 'popup', 'index.html'),
            filename: 'popup.html',
            chunks: []
        }),
    ],
    devtool: IS_PRODUCTION ? '' : 'inline-source-map',
    resolve: {
        extensions: ['.js', '.jsx']
    },
};
