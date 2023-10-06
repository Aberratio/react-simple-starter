const fs = require("fs");
const errorOverlayMiddleware = require("react-dev-utils/errorOverlayMiddleware");
const evalSourceMapMiddleware = require("react-dev-utils/evalSourceMapMiddleware");
const noopServiceWorkerMiddleware = require("react-dev-utils/noopServiceWorkerMiddleware");
const ignoredFiles = require("react-dev-utils/ignoredFiles");
const redirectServedPath = require("react-dev-utils/redirectServedPathMiddleware");

const paths = require("./paths");
const getHttpsConfig = require("./getHttpsConfig");

const host = process.env.HOST || "0.0.0.0";
const sockHost = process.env.WDS_SOCKET_HOST;
const sockPath = process.env.WDS_SOCKET_PATH;
const sockPort = process.env.WDS_SOCKET_PORT;

module.exports = function (proxy, allowedHost) {
  return {
    client: {
      overlay: false,
      webSocketURL: {
        hostname: sockHost,
        pathname: sockPath,
        port: sockPort,
      },
    },
    compress: true,
    devMiddleware: {
      publicPath: paths.publicUrlOrPath.slice(0, -1),
    },
    historyApiFallback: {
      disableDotRule: true,
      index: paths.publicUrlOrPath,
    },
    hot: true,
    host,
    https: getHttpsConfig(),
    proxy,
    static: {
      watch: {
        ignored: ignoredFiles(paths.appSrc),
      },
    },
    webSocketServer: {
      options: {
        path: allowedHost,
      },
    },
    onAfterSetupMiddleware() {
      redirectServedPath(paths.publicUrlOrPath);
      noopServiceWorkerMiddleware(paths.publicUrlOrPath);
    },
    onBeforeSetupMiddleware(server) {
      evalSourceMapMiddleware(server);
      errorOverlayMiddleware();

      if (fs.existsSync(paths.proxySetup)) {
        require(paths.proxySetup)(app);
      }
    },
  };
};
