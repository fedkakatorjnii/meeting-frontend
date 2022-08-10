const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const projectRoot = path.resolve(__dirname);

const config = {
  mode: 'development',
  entry: './src/index.tsx',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(projectRoot, 'dist'),
    publicPath: '/',
    filename: '[name].[contenthash].js',
    uniqueName: 'my-application',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/i,
      },
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/png',
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: 'file-loader',
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new Dotenv({
      path: './.env',
      safe: true,
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new HtmlWebpackPlugin({
      template: './template.html',
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: [path.resolve(projectRoot, 'node_modules'), 'node_modules'],
    alias: {
      process: 'process/browser',
      '@API': path.resolve(projectRoot, 'src/API'),
      '@ui': path.resolve(projectRoot, 'src/ui/'),
    },
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};

module.exports = config;
