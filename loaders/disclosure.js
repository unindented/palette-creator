module.exports = function (source) {
  this.cacheable()

  return source.toString().replace(/\(\)\n$/g, '.call(window)\n')
}
