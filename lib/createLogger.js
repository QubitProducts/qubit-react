var logger = require('driftwood')('qubit-react-wrapper')

module.exports = function createLogger (componentName) {
  return logger(componentName)
}
