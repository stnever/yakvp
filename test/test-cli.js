var assert = require('assert'),
    parse = require('../yakvp').common(),
    fromCli = require('../from-cli');

describe('YAKVP cli', function() {

  it('should parse command line args', function() {

    var result = parse(fromCli([
      'vehicleId=123',
      'fromDate=2015-01-01T13:59:59Z'
    ]))

    assert(result != null)
    assert(result.vehicleId == 123)
    assert(result.fromDate instanceof Date)
  })
})