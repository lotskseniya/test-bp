const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, "dist"),
    clean: true,
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        options: {
          sources: false,
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "body",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "public"),
          to: "public",
        },
      ],
    }),
  ],
  resolve: {
    extensions: [".js", ".scss", ".css"],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
        },
      },
    },
    minimize: false,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
          mangle: false,
        },
        extractComments: false,
      }),
    ],
  },
  stats: {
    children: true,
  },
  mode: "development",
  devtool: "source-map",
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
    hot: true,
    open: true,
    liveReload: true,
  },
};
