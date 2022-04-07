const path = require("path");
const GasPlugin = require("gas-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    main: path.resolve(__dirname, "src", "index.ts"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      handlebars: "handlebars/dist/handlebars.js",
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new GasPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "appsscript.json"),
        },
      ],
    }),
  ],
};
