var path = require('path')
module.exports = {
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
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  }
}
