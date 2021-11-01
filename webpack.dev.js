const baseConfig = require('./webpack.common')

const webpack = require('webpack')
const { mergeWithRules } = require('webpack-merge')

const config = {
  mode: 'development',
  devtool: 'eval-source-map',
  watchOptions: {
    ignored: /node_modules/
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}

module.exports = mergeWithRules({
  module: {
    rules: {
      test: 'match',
      use: {
        loader: 'match',
        options: 'merge',
      },
    },
  },
})(baseConfig, config)
