var path = require('path')
module.exports = {
  mode: 'development',
  entry: {
    bundle: ['./src/app.js'],
    smartserve: ['./experiment/smartserve.js']
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/assets/',
    filename: '[name].js'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  }
}
