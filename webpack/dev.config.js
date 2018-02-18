const path = require('path');
const webpack = require('webpack');

const host = 'localhost';
const port = 3000;
const customPath = path.join(__dirname, './customPublicPath');
const hotScript = 'webpack-hot-middleware/client?path=__webpack_hmr&dynamicPublicPath=true';

const baseDevConfig = () => ({
    devtool: 'eval-cheap-module-source-map',
    entry: {
        background: [customPath, hotScript, path.join(__dirname, '../chrome/extension/background')],
    },
    devMiddleware: {
        publicPath: `http://${host}:${port}/js`,
        stats: {
            colors: true
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true'
        },
        noInfo: true
    },
    hotMiddleware: {
        path: '/js/__webpack_hmr'
    },
    output: {
        path: path.join(__dirname, '../dev/js'),
        filename: '[name].bundle.js',
        chunkFilename: '[id].chunk.js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.IgnorePlugin(/[^/]+\/[\S]+.prod$/),
        new webpack.DefinePlugin({
            __HOST__: `'${host}'`,
            __PORT__: port,
            'process.env': {
                NODE_ENV: JSON.stringify('development')
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
            exclude: /node_modules/,
            query: {
                presets: ['react-hmre']
            }
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
});

const injectPageConfig = baseDevConfig();
injectPageConfig.entry = [
    customPath,
    path.join(__dirname, '../chrome/extension/inject')
];
delete injectPageConfig.hotMiddleware;
delete injectPageConfig.module.loaders[0].query;
injectPageConfig.plugins.shift(); // remove HotModuleReplacementPlugin
injectPageConfig.output = {
    path: path.join(__dirname, '../dev/js'),
    filename: 'inject.bundle.js',
};
const appConfig = baseDevConfig();

module.exports = [
    injectPageConfig,
    appConfig
];
