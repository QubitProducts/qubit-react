var _ = require('slapdash')

module.exports = function createObjectPath (root, path) {
  path = _.isArray(path) ? path : path.split('.')
  return path.reduce(function (memo, nextPath) {
    memo[nextPath] = memo[nextPath] || {}
    return memo[nextPath]
  }, root)
}
