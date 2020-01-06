const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const config = {
  entry: "./src/main-library.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        use: ["awesome-typescript-loader"],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  devServer: {
    contentBase: "./"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      mothershipUrl: process.env.MOTHERSHIP_URL,
      hash: true,
      filename: "./index.html",
      template: "./src/index.html"
    })
  ]
};

module.exports = config;
