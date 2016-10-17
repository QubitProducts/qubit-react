var driftwood = require('driftwood')

var logger

function exportApi () {
  window.__qubit = window.__qubit || {}
  if (!window.__qubit.logger) {
    window.__qubit.logger = {
      enable: driftwood.enable,
      disable: driftwood.disable,
      LEVELS: driftwood.LEVELS
    }
  }
}

module.exports = function createLogger (componentName) {
  if (!logger) {
    logger = driftwood('qubit-react-wrapper')
    exportApi()
  }
  return logger(componentName)
}
