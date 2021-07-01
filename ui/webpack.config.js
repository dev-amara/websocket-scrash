const path = require("path");
const webpack = require("webpack");
const { description, keywords, name } = require("./package.json");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const sourcePath = path.join(__dirname, "./src");
const outPath = path.join(__dirname, "./lib");

module.exports = () => {
  return {
    context: sourcePath,
    entry: {
      app: "./main.tsx",
    },
    output: {
      publicPath: "/",
      path: outPath,
      filename: "[name].js",
      chunkFilename: "[name].[fullhash].js",
    },
    target: "web",
    mode: "development",
    devServer: {
      contentBase: sourcePath,
      hot: true,
      inline: true,
      historyApiFallback: {
        disableDotRule: true,
      },
      stats: "minimal",
      clientLogLevel: "warning",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
      },
    },
    module: {
      rules: [
        // .ts, .tsx
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: "babel-loader",
              options: { plugins: ["react-hot-loader/babel"] },
            },
            "ts-loader",
          ],
        },
        // static assets
        { test: /\.html$/, use: "html-loader" },
        { test: /\.(a?png|svg)$/, use: "url-loader?limit=10000" },
        {
          test: /\.(jpe?g|gif|bmp|mp3|mp4|ogg|wav|eot|ttf|woff|woff2)$/,
          use: "file-loader",
        },
      ],
    },
    optimization: {
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

      runtimeChunk: true,
    },
    resolve: {
      extensions: [".js", ".ts", ".tsx"],
      mainFields: ["module", "browser", "main"],
      alias: {
        app: path.resolve(__dirname, "src/app/"),
        "react-dom": "@hot-loader/react-dom",
        assets: path.resolve(__dirname, "src/assets/"),
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: "process/browser",
      }),
      new webpack.EnvironmentPlugin({
        API_ENV: "development", // use 'development' unless process.env.NODE_ENV is defined
        DEBUG: false,
      }),
      new webpack.SourceMapDevToolPlugin({
        filename: "[file].map[query]",
      }),
      new CleanWebpackPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        template: "assets/index.html",
        minify: {
          minifyJS: true,
          minifyCSS: true,
          removeComments: true,
          useShortDoctype: true,
          collapseWhitespace: true,
          collapseInlineTagWhitespace: true,
        },
        append: {
          head: `<script src="//cdn.polyfill.io/v3/polyfill.min.js"></script>`,
        },
        meta: {
          title: name,
          description: description,
          keywords: Array.isArray(keywords) ? keywords.join(",") : undefined,
        },
      }),
    ],
    devtool: "eval-cheap-module-source-map",
  };
};
