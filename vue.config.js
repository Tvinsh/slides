const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: "./",
  productionSourceMap: false,
  outputDir: "docs",
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src")
      }
    },
    plugins: []
  },
  chainWebpack() {},
  devServer: {
    host: "127.0.0.1",
    port: 80
  }
};
