const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./App.ts",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/", // ensures assets resolve from root
  },
  // output: {
  //   filename: 'app.js',
  //   path: path.resolve(__dirname, 'dist'),
  // },
  plugins: [
    new HtmlWebpackPlugin({
      // title: "Curious Reader",
      template: "index.html",
      // filename: "index.html",
    }),
  ],
  experiments: {
    topLevelAwait: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
  },
};
