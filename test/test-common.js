var assert = require('assert'),
    parse = require('../yakvp.js').common();

describe('YAKVP Builder', function() {

  it('should parse with default spec', function() {
    var result = parse({
      'vehicleId': '123',
      'fromDate': '2015-01-01T13:59:59Z',
      'latitude': '-22.12345',
      'isPaused': 'true',
      'isNotNumber': ' 123'

    });

    assert(result != null)
    assert.equal(result.vehicleId, 123)
    assert.equal(result.isPaused, true)
    assert(result.isNotNumber !== 123)
    assert(result.fromDate instanceof Date)
  })

  it('should parse with default and extra spec', function() {
    parse.add({
      'status': '[string]'
    })

    var result = parse({
      'status': 'closed,ongoing'
    })

    assert(result != null)
    assert(result.status.length == 2)
  })

})