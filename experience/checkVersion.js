var log = require('./createLogger')
var experienceVersion = require('../lib/libraryVersion')
var namespace = require('../lib/namespace')

module.exports = function checkVersion () {
  var wrapperVersion = namespace.getReact().version
  if (wrapperVersion !== experienceVersion) {
    log.warn(`qubit-react/experience is on version ${experienceVersion} and qubit-react/wrapper is on verion ${wrapperVersion}`)
  }
}
