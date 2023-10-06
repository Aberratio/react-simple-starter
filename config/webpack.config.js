const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const getClientEnvironment = require("./env");
const paths = require("./paths");

module.exports = function (webpackEnv) {
  const isEnvDevelopment = webpackEnv === "development";
  const isEnvProduction = webpackEnv === "production";
  const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

  return {
    devServer: {
      client: false,
      clientLogLevel: "none",
      contentBase: paths.appPublic,
      contentBasePublicPath: paths.publicUrlOrPath,
      watchContentBase: true,
      webSocketServer: "ws",
      allowedHosts: "all",
    },
    devtool: "source-map",
    entry: [
      isEnvDevelopment &&
        require.resolve("react-dev-utils/webpackHotDevClient"),
      paths.appIndexJs,
    ].filter(Boolean),
    mode: isEnvProduction ? "production" : isEnvDevelopment && "development",
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|bmp)$/i,
          exclude: /node_modules/,
          type: "asset/resource",
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
      ],
    },
    output: {
      path: isEnvProduction ? paths.appBuild : undefined,
      pathinfo: isEnvDevelopment,
      filename: isEnvProduction
        ? "my-app.js"
        : isEnvDevelopment && "static/js/bundle.js",
      chunkFilename: isEnvProduction
        ? "[name].[contenthash:8].chunk.js"
        : isEnvDevelopment && "static/js/[name].chunk.js",
      publicPath: paths.publicUrlOrPath,
      devtoolModuleFilenameTemplate: isEnvProduction
        ? (info) =>
            path
              .relative(paths.appSrc, info.absoluteResourcePath)
              .replace(/\\/g, "/")
        : isEnvDevelopment &&
          ((info) =>
            path.resolve(info.absoluteResourcePath).replace(/\\/g, "/")),
      globalObject: "this",
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: paths.appHtml,
        ...(isEnvProduction
          ? {
              minify: {
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
            }
          : undefined),
      }),
      new MiniCssExtractPlugin({
        filename: "my-app.css",
      }),
      new webpack.DefinePlugin(env.stringified),
      isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
    ],
    resolve: {
      extensions: [".js", ".jsx", ".tsx", ".ts"],
      fallback: { url: require.resolve("url/") },
    },
    target: isEnvProduction ? "browserlist" : "web",
  };
};
