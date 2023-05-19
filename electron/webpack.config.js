const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const webpack = require("webpack");

const config = {
  entry: {
    index: path.join(__dirname, "src", "index.js"),
  },
  output: {
    path: path.resolve(__dirname, "build/"),
    publicPath: "/",
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[chunkhash].js",
    assetModuleFilename: "[path][name].[contenthash][ext][query]",
    clean: true,
  },
  optimization: {
    chunkIds: "natural",
    concatenateModules: true,
    splitChunks: {
      chunks: "async",
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(mp3|png|jp(e*)g|svg|gif)$/,
        use: ["file-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
  ],
  devServer: {
    hot: true,
    // https: true,
    port: 4000,
    historyApiFallback: true,
    client: {
      overlay: {
        warnings: false,
        errors: true,
      },
    },
  },
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
};

// config.plugins.push(
//     new WorkboxPlugin.GenerateSW({
//         clientsClaim: true,
//         skipWaiting: true,
//         maximumFileSizeToCacheInBytes: 5000000,
//         disableDevLogs: true,
//     })
// );

module.exports = config;
