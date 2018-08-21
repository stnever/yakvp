const parse = require('../yakvp.js').common()

test('should parse with default spec', () => {
  let result = parse({
    'vehicleId': '123',
    'fromDate': '2015-01-01T13:59:59Z',
    'latitude': '-22.12345',
    'isPaused': 'true',
    'isNotNumber': ' 123',
    'tags': 'tag1',
    'withoutTags': 'tag2,tag3',
    'id': '444'
  })

  expect(result != null)
  expect(result.vehicleId).toBe(123)
  expect(result.isPaused).toBe(true)
  expect(result.isNotNumber).not.toBe(123)
  expect(result.fromDate instanceof Date).toBe(true)
  expect(result.id).toBe(444)
  expect(result.tags).toEqual(['tag1'])
  expect(result.withoutTags).toEqual(['tag2', 'tag3'])
})

test('should parse with default and extra spec', () => {
  parse.add({
    'status': '[string]'
  })

  let result = parse({
    'status': 'closed,ongoing'
  })

  expect(result.status.length).toBe(2)
})
