const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProd = process.env.NODE_ENV === "production";

const optimization = !isProd
  ? {
      minimize: false,
    }
  : {
      minimizer: [
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
          },
        }),
      ],
    };

module.exports = {
  entry: path.join(__dirname, "index.tsx"),
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".css", ".less"],
    alias: {
      "@": path.join(__dirname),
    },
  },
  devtool: isProd ? false : "inline-source-map",
  externals: { vscode: "vscode" },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: "/node_modules/",
      },
      {
        test: /\.less$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "..", "out", "web"),
    publicPath: "<%=staticPath%>",
  },
  optimization,
  plugins: [
    // isProd &&
    //   new MiniCssExtractPlugin({
    //     // Options similar to the same options in webpackOptions.output
    //     // both options are optional
    //     filename: "style.css",
    //   }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./index.html"),
      filename: "index.html",
      cache: false,
      inject: true,
      chunks: ["main"],
      // Nerver minify
      minify: true
        ? false
        : {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          },
    }),
  ].filter(Boolean),
};
