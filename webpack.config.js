"use strict";

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const root = path.join(__dirname);
const webpack = require("webpack");

module.exports = {
  entry: [
    "react-hot-loader/patch",
    path.join(root, "lib", "assets", "index.js")
  ],
  output: {
    path: path.join(root, "_dist"),
    filename: "bundle.js"
  },
  devServer: {
    contentBase: path.join(root, "_dist"),
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.(css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [require("autoprefixer"), require("precss")]
            }
          }
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: "initial"
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(root, "lib", "templates", "index.html")
    }),
    new MiniCssExtractPlugin()
  ],
  resolve: {
    extensions: ["*", ".js", ".jsx"]
  }
};
