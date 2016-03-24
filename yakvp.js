var _ = require('lodash'),
    moment = require('moment');

exports.common = function() {
  return exports.build({
    '*Date': 'date',
    '*Ids': '[int]',
    '*Id': 'int',
    'limit,offset': 'int',
    '=true,=false': 'bool',
    '=/^[-\\d\\.]*$/': 'float'
  })
}

exports.build = function(spec) {

  var rules = preProcess(spec)

  var parse = function(params) {
    return doParse(rules, params)
  }

  parse.add = function(newSpec) {
    rules = rules.concat(preProcess(newSpec))
    return parse
  }

  // alias (para poder chamar build().parse() ou apenas build()())
  parse.parse = parse

  return parse
}

function preProcess(rules) {
  var result = []

  _.forOwn(rules, function(format, strPat) {

    var basedOn = 'key';
    if ( strPat.charAt(0) == '=' ) {
      basedOn = 'value'
      strPat = strPat.slice(1)
    }

    // Se estiver entre //, é porque já é uma regexp.
    var re = null;
    if ( strPat.match('^/.*/$') ) {
      re = new RegExp(strPat.slice(1, -1))
    }

    else {
      strPat = strPat.replace(/\*/g, '.*')

      if ( strPat.indexOf(',') != -1 )
        strPat = '(' + strPat.split(',').join('|') + ')'

      re = new RegExp('^' + strPat + '$')
    }

    result.push({
      basedOn: basedOn,
      pattern: re,
      format: format.toLowerCase()
    })
  })

  return result
}

function doParse(rules, params) {
  var result = {}

  _.forOwn(params, function(value, key) {
    var rule = _.find(rules, function(r) {
      if ( r.basedOn == 'key' ) return r.pattern.test(key);
      else return r.pattern.test(value)
    })

    if ( rule != null ) {

      if ( rule.format.indexOf('[') != -1 && !_.isArray(value))
        value = value.split(',')

      value = _.isArray(value)
        ? value.map(function(v) { return parseOne(v, rule.format) })
        : parseOne(value, rule.format)
    }

    if ( value != null && !_.isNaN(value))
      result[key] = value
  })

  return result
}

function parseOne(str, format) {
  if ( format.indexOf('int') != -1 )
    return parseInt(str);
  if ( format.indexOf('float') != -1 )
    return parseFloat(str);
  if ( format.indexOf('date') != -1 )
    return moment(str).toDate();
  if ( format.indexOf('bool') != -1 )
    return str == 'true';
  return str;
}

