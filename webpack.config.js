const {resolve} = require('path');

module.exports = env => {
  return {
    entry: {
      'issue-translator': './src/app.js'
    },
    output: {
      filename: '[name].js',
      path: resolve(__dirname, 'dist'),
      pathinfo: !env.prod,
    },
    devtool: env.prod ? 'source-map' : 'eval',
    module: {
      rules: [
        {test: /\.js$/, use: ['babel-loader'], exclude: /node_modules/}
      ]
    }
  };
};
