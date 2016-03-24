var _ = require('lodash')

module.exports = function fromCli(args) {
  if ( args == null ) {
    args = process.argv
  }

  var result = {}
  _.forEach(args, function(arg) {
    if ( arg.indexOf('=') == -1 ) return;
    var pieces = arg.split('=')
    result[pieces[0]] = pieces.length > 0 ? pieces[1] : null
  })

  return result
}