module.exports = function (meta) {
  var registrar = meta && (meta.registrar || meta.experimentId)
  if (!registrar) {
    throw new Error('No registrar specified')
  }
  return {
    register: require('./register')(registrar)
  }
}
