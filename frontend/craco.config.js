const path = require("path");

function makeDevServerV5Compatible(config) {
  const {
    https,
    onAfterSetupMiddleware,
    onBeforeSetupMiddleware,
    onListening,
    setupMiddlewares,
    ...compatibleConfig
  } = config;

  compatibleConfig.server = https
    ? typeof https === "object"
      ? { type: "https", options: https }
      : "https"
    : "http";
  compatibleConfig.headers = {
    ...compatibleConfig.headers,
    "Cross-Origin-Resource-Policy": "same-origin",
  };

  compatibleConfig.setupMiddlewares = (middlewares, devServer) => {
    onBeforeSetupMiddleware?.(devServer);
    const result = setupMiddlewares
      ? setupMiddlewares(middlewares, devServer)
      : middlewares;

    devServer.close ??= (callback) => devServer.stopCallback(callback);
    onAfterSetupMiddleware?.(devServer);
    return result;
  };

  compatibleConfig.onListening = (devServer) => {
    devServer.close ??= (callback) => devServer.stopCallback(callback);
    onListening?.(devServer);
  };

  return compatibleConfig;
}

module.exports = {
  eslint: {
    configure: {
      extends: ["plugin:react-hooks/recommended"],
      rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
      },
    },
  },
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  devServer: makeDevServerV5Compatible,
};
