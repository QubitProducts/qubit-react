var createRegister = require('./createRegister')

module.exports = function (meta) {
  var owner = meta && (meta.owner || meta.experimentId)
  if (!owner) {
    throw new Error('No owner specified')
  }
  return {
    register: createRegister(owner)
  }
}
