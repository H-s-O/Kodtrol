const path = require('path');
const webpack = require('webpack');

const APP_DIR = path.join(__dirname, '../src/ui');
const OUTPUT_DIR = path.join(__dirname, '../dist/ui');
const NODE_MODULES_DIR = path.join(__dirname, '../node_modules');

module.exports = {
  entry: {
    ui: path.join(__dirname, '../src/ui/index.js'),
  },
  output: {
    filename: 'index.js',
    path: OUTPUT_DIR,
  },
  devtool: 'source-map',
  devServer: {
    contentBase: OUTPUT_DIR,
    hot: true,
  },
  module: {
     rules: [
       {
        test : /\.jsx?$/,
        include : APP_DIR,
        exclude: NODE_MODULES_DIR,
        loader : 'babel-loader'
      },
      {
        test: /main\.scss$/,
        include : APP_DIR,
        loaders: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.scss$/,
        include : APP_DIR,
        exclude: path.join(APP_DIR, 'styles/main.scss'),
        loaders: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]'
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
        loader: 'url-loader'
      },
     ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    extensions: [".js", ".jsx", "scss"]
  },
};
