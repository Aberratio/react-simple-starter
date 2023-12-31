const fs = require("fs");
const path = require("path");
const chalk = require("react-dev-utils/chalk");
const resolve = require("resolve");

const paths = require("./paths");

function getAdditionalModulePaths(options = {}) {
  const { baseUrl } = options;

  if (baseUrl == null) {
    const nodePath = process.env.NODE_PATH || "";
    return nodePath.split(path.delimiter).filter(Boolean);
  }

  const baseUrlResolved = path.resolve(paths.appPath, baseUrl);

  if (path.relative(paths.appNodeModules, baseUrlResolved) === "") {
    return null;
  }

  if (path.relative(paths.appSrc, baseUrlResolved) === "") {
    return [paths.appSrc];
  }

  if (path.relative(paths.appPath, baseUrlResolved) === "") {
    return null;
  }

  throw new Error(
    chalk.red.bold(
      "Your project's `baseUrl` can only be set to `src` or `node_modules`."
    )
  );
}

function getWebpackAliases(options = {}) {
  const { baseUrl } = options;

  if (!baseUrl) {
    return {};
  }

  const baseUrlResolved = path.resolve(paths.appPath, baseUrl);

  if (path.relative(paths.appPath, baseUrlResolved) === "") {
    return {
      src: paths.appSrc,
    };
  }
}

function getModules() {
  const hasTsConfig = fs.existsSync(paths.appTsConfig);
  const hasJsConfig = fs.existsSync(paths.appJsConfig);

  if (hasTsConfig && hasJsConfig) {
    throw new Error(
      "You have both a tsconfig.json and a jsconfig.json. If you are using TypeScript please remove your jsconfig.json file."
    );
  }

  let config;

  if (hasTsConfig) {
    const ts = require(
      resolve.sync("typescript", {
        basedir: paths.appNodeModules,
      })
    );
    config = ts.readConfigFile(paths.appTsConfig, ts.sys.readFile).config;
  } else if (hasJsConfig) {
    config = require(paths.appJsConfig);
  }

  config = config || {};
  const options = config.compilerOptions || {};

  const additionalModulePaths = getAdditionalModulePaths(options);

  return {
    additionalModulePaths,
    webpackAliases: getWebpackAliases(options),
    hasTsConfig,
  };
}

module.exports = getModules();
