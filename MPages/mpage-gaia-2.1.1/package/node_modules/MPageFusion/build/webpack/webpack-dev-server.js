const WebpackDevServer = require("webpack-dev-server");
const webpack = require("webpack");
const config = require("./config/dev.config.js");

const compiler = webpack(config);
const port = Number(process.env.PORT || 1337);

const server = new WebpackDevServer(compiler, {
    publicPath: config.output.publicPath,
    historyApiFallback: true,
    noInfo: true,
    disableHostCheck: true,
    overlay: true,
    contentBase: "./build"
});
server.listen(port, () => {
    console.log(`Server started. Please go to http://localhost:${port}`);
});
