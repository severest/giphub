const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const DIST_DIR = path.resolve(__dirname, 'dist');
const SRC_DIR = path.resolve(__dirname, 'src');
const ASSET_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'eot', 'otf', 'svg', 'ttf', 'woff', 'woff2'];
const MANIFEST_FILE = 'manifest.json';

const manifestPath = path.join(SRC_DIR, MANIFEST_FILE);

module.exports = {
  output: {
    filename: MANIFEST_FILE,
    path: DIST_DIR,
  },
  entry: manifestPath,
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          'file-loader',
          'extract-loader',
          {
            loader: 'html-loader',
            options: {
              minimize: IS_PRODUCTION,
              attrs: [
                'link:href',
                'script:src',
                'img:src'
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
              minimize: IS_PRODUCTION
            }
          }
        ]
      },
      {
        test: /\/entry\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
          loader: 'spawn-loader',
          options: {
            name: '[hash].js'
          }
        }]
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
        test: new RegExp('\.(' + ASSET_EXTENSIONS.join('|') + ')$'),
        exclude: /app/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'assets/'
          }
        }
      },
      {
        test: new RegExp('\.(' + ASSET_EXTENSIONS.join('|') + ')$'),
        exclude: /(icon|screenshots)/,
        use: {
          loader: 'url-loader',
        }
      },
      {
        test: manifestPath,
        use: ExtractTextPlugin.extract([
          'raw-loader',
          'extricate-loader',
          'interpolate-loader'
        ])
      },
      // Workaround for https://github.com/webpack/webpack/issues/5828
      {
        test: require.resolve('webextension-polyfill'),
        use: 'imports-loader?browser=>undefined'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(DIST_DIR),
    new ExtractTextPlugin(MANIFEST_FILE),
    new webpack.ProvidePlugin({
      browser: 'webextension-polyfill'
    }),
  ],
  devtool: IS_PRODUCTION ? '' : 'inline-source-map',
  resolve: {
    extensions: ['.js', '.jsx']
  },
};
