function isValid (version) {
  return /^\d+\.\d+\.\d+$/.test(version)
}

function getMajor (version) {
  return isValid(version) && Number(version.split('.')[0])
}

function getMinor (version) {
  return isValid(version) && Number(version.split('.')[1])
}

function getPatch (version) {
  return isValid(version) && Number(version.split('.')[2])
}

module.exports = {
  isValid: isValid,
  getMajor: getMajor,
  getMinor: getMinor,
  getPatch: getPatch
}
