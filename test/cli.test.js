const parse = require('../yakvp').common(),
      fromCli = require('../from-cli');

test('should parse command line args', () => {
  var result = parse(fromCli([
    'vehicleId=123',
    'fromDate=2015-01-01T13:59:59Z'
  ]))

  expect(result).not.toBeFalsy()
  expect(result.vehicleId).toBe(123)
  expect(result.fromDate).toEqual(new Date(Date.UTC(2015,0,1,13,59,59)))
})

test('should work with --vehicleIds all', () => {
  let result = parse({vehicleIds: 'all'}, {lenient:true})
  expect(result.vehicleIds).toEqual('all')
})
