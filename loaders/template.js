var template = require('lodash/template')
var pkg = require('../package.json')

module.exports = function (source) {
  this.cacheable()

  return template(source.toString())(pkg)
}
