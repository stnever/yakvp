var _ = require('lodash'),
    assert = require('assert'),
    yakvp = require('../yakvp');

describe('YAKVP Spec', function() {

  it('should parse ints', function() {
    var parsed = yakvp
      .build({id: 'int'})
      .parse({id: '123'})

    assert.equal(parsed.id, 123)
  })

  it('should parse array of ints', function() {
    var parsed = yakvp.build({
      ids: '[int]'
    }).parse({
      ids: '1,2,3'
    })

    assert(_.isArray(parsed.ids))
    assert.equal(parsed.ids[0], 1)
  })

  it('should parse dates', function() {
    var parsed = yakvp.build({
      '*Date': 'date'
    }).parse({
      fromDate : '2015-02-17T10:00:00Z',
      untilDate: '2015-01-17T10:00:00Z',
      preDateId: '123'
    })

    assert(_.isDate(parsed.fromDate))
    assert(_.isDate(parsed.untilDate))
    assert(_.isString(parsed.preDateId))
  })

  it('should parse floats', function() {
    var parsed = yakvp
      .build({lat: 'float'})
      .parse({lat: '-22.12345'})

    assert.equal(parsed.lat, -22.12345)
  })

  it('should parse booleans', function() {
    var parsed = yakvp
      .build({'is*': 'bool'})
      .parse({isX: 'true', isY: 'false'})

    assert.equal(parsed.isX, true)
    assert.equal(parsed.isY, false)
  })

  it('should parse based on values', function() {
    var parsed = yakvp
      .build({'=true': 'bool'})
      .parse({isX: 'true', isY: 'blargh'})

    assert.equal(parsed.isX, true)
    assert.equal(parsed.isY, 'blargh')
  })
})