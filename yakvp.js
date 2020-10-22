const _ = require('lodash'),
      moment = require('moment')

const _commonSpec = {
  'id'              : 'int',
  'ids'             : '[int]',
  'tags'            : '[string]',
  '*Tags'           : '[string]',
  '*Date'           : 'date',
  '*Ids'            : '[int]',
  '*Id'             : 'int',
  'limit,offset'    : 'int',
  '=true,=false'    : 'bool',
  '=/^[-+]?[\\d\\.]+$/' : 'float'
}

exports.create = function(spec={}, {skipCommon=false}={}) {
  if ( !skipCommon ) spec = _.defaults(spec, _commonSpec)
  return exports.build(spec)
}

exports.common = function() {
  return exports.build(_commonSpec)
}

exports.build = function(rules) {
  let spec = new Spec(rules)
  let parse = function(data, {lenient=false}={}) {
    spec.lenient = lenient
    return doParse(spec, data)
  }

  parse.add = newRules => {
    spec.add(newRules)
    return parse
  }

  // alias para poder chamar build().parse() ou apenas build()()
  parse.parse = parse
  return parse
}

function doParse(spec, params) {
  var result = {}

  _.forOwn(params, (value, key) => {
    let rule = findRule(spec, key, value)

    if ( rule != null ) {
      try {
        let newVal = applyRule(rule, value)
        value = newVal
      } catch ( err ) {
        if ( !spec.lenient ) throw err
        // se for lenient, deixa value como está
      }
    }

    result[key] = value
  })

  return result
}

function findRule(spec, key, value) {
  return _.find(spec.rules, r => {
    if ( r.basedOn == 'key' ) return r.pattern.test(key)
    else return r.pattern.test(value)
  })
}

function applyRule(rule, value) {
  // Converte para array, se necessário
  if ( rule.isArray && !_.isArray(value) )
    value = toArray(value)

  // Parseia
  let result = _.isArray(value)
    ? value.map(v => parseOne(v, rule))
    : parseOne(value, rule)
  return result
}

function toArray(val) {
  if ( val == null ) return []
  if ( _.isString(val) ) return _.compact(val.split(','))
  return [val]
}

function toInt(v) {
  let r = parseInt(v)
  if ( !_.isFinite(r) ) throw new Error('Bad int: ' + v)
  return r
}

function toFloat(v) {
  let r = parseFloat(v)
  if ( !_.isFinite(r) ) throw new Error('Bad float: ' + v)
  return r
}

function toDate(v) {
  let r = moment(v)
  if ( !r.isValid() ) throw new Error('Bad date: ' + v)
  return r.toDate()
}

function toBool(v) {
  if ( v == 'true' ) return true
  if ( v == 'false') return false
  throw new Error('Bad bool: ' + v)
}

function parseOne(val, rule) {
  if ( ! _.isString(val) ) return val
  if ( rule.dataType == 'int'   ) return toInt(val)
  if ( rule.dataType == 'float' ) return toFloat(val)
  if ( rule.dataType == 'date'  ) return toDate(val)
  if ( rule.dataType == 'bool'  ) return toBool(val)
  return val
}

class Rule {
  constructor(strPat, format) {
    this.basedOn = 'key'
    if ( strPat.charAt(0) == '=' ) {
      this.basedOn = 'value'
      strPat = strPat.slice(1)
    }

    // Se estiver entre //, é porque já é uma regexp.
    this.pattern = null
    if ( strPat.match('^/.*/$') ) {
      this.pattern = new RegExp(strPat.slice(1, -1))
    }

    else {
      strPat = strPat.replace(/\*/g, '.*')

      if ( strPat.indexOf(',') != -1 )
        strPat = '(' + strPat.split(',').join('|') + ')'

      this.pattern = new RegExp('^' + strPat + '$')
    }

    this.isArray = format.indexOf('[') != -1

    this.dataType = 'string'
    if ( format.indexOf('int')   != -1 ) this.dataType = 'int'
    if ( format.indexOf('float') != -1 ) this.dataType = 'float'
    if ( format.indexOf('date')  != -1 ) this.dataType = 'date'
    if ( format.indexOf('bool')  != -1 ) this.dataType = 'bool'
  }
}

class Spec {
  constructor(rules, lenient=false) {
    this.lenient = lenient
    this.rules = []
    this.add(rules)
  }

  add(rules) {
    _.forOwn(rules, (v, k) => {
      this.rules.push(new Rule(k, v))
    })
    return this
  }
}
