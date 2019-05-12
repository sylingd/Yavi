const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env) => ({
  plugins: [
    new UglifyJSPlugin({
        sourceMap: true
    })
  ]
});