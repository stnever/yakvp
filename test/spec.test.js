const _ = require('lodash'),
      yakvp = require('../yakvp')

test('should parse ints', () => {
  let parsed = yakvp
    .build({id: 'int'})
    .parse({id: '123'})

  expect(parsed.id).toEqual(123)
})

test('should parse array of ints', () => {
  let parsed = yakvp.build({
    ids: '[int]'
  }).parse({
    ids: '1,2,3'
  })

  expect(_.isArray(parsed.ids)).toBe(true)
  expect(parsed.ids[0]).toEqual(1)
})

test('should parse empty array of ints', () => {
  let parsed = yakvp.build({
    ids: '[int]'
  }).parse({
    ids: ''
  })
  expect(_.isArray(parsed.ids)).toBe(true)
  expect(parsed.ids.length).toEqual(0)
})

test('should parse dates', () => {
  let parsed = yakvp.build({
    '*Date': 'date'
  }).parse({
    fromDate : '2015-02-17T10:00:00Z',
    untilDate: '2015-01-17T10:00:00Z',
    preDateId: '123'
  })

  expect(_.isDate(parsed.fromDate)).toBe(true)
  expect(_.isDate(parsed.untilDate)).toBe(true)
  expect(_.isString(parsed.preDateId)).toBe(true)
})

test('should parse floats', () => {
  let parsed = yakvp
    .build({lat: 'float'})
    .parse({lat: '-22.12345'})

  expect(parsed.lat).toEqual(-22.12345)
})

test('should parse booleans', () => {
  let parsed = yakvp
    .build({'is*': 'bool'})
    .parse({isX: 'true', isY: 'false'})

  expect(parsed.isX).toEqual(true)
  expect(parsed.isY).toEqual(false)
})

test('should parse based on values', () => {
  let parsed = yakvp
    .build({'=true': 'bool'})
    .parse({isX: 'true', isY: 'blargh'})

  expect(parsed.isX).toBe(true)
  expect(parsed.isY).toEqual('blargh')
})

test('should not modify other params', () => {
  let parsed = yakvp.common().parse({v: true})
  expect(parsed.v).toBe(true)
})

test('should not modify already parsed values', () => {
  let parsed = yakvp.common().parse({
    aIds: 1,
    bIds: '1',
    cIds: [1],
    dIds: [1,2],
    eIds: '1,2'
  })

  expect(parsed.aIds).toEqual([1])
  expect(parsed.bIds).toEqual([1])
  expect(parsed.cIds).toEqual([1])
  expect(parsed.dIds).toEqual([1,2])
  expect(parsed.eIds).toEqual([1,2])
})

test('should not modify already parsed values - strings', () => {
  let parsed = yakvp.common().parse({
    aTags: 'a',
    bTags: ['a'],
    cTags: 'a,b',
    dTags: ['a','b']
  })

  expect(parsed.aTags).toEqual(['a'])
  expect(parsed.bTags).toEqual(['a'])
  expect(parsed.cTags).toEqual(['a', 'b'])
  expect(parsed.dTags).toEqual(['a', 'b'])
})
