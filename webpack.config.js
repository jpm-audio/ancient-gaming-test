const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.ts',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    hot: true,
    open: true,
    port: 3000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Ancient Gaming Test',
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: 'assets/**',

          // if there are nested subdirectories , keep the hierarchy
          to: '[path][name][ext]',
        },
      ],
    }),
    new MiniCssExtractPlugin(),
  ],
  optimization: {
    usedExports: true,
    minimize: true,
  },
  mode: process.env.NODE_ENV || 'development',
};
