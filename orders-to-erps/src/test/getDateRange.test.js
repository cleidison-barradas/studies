const getDateRange = require('../utils/getDateRange')
const moment = require('moment')

describe('getDateRange', () => {
  test('should return the date range correctly', () => {
    const date = '2023-07-01'
    const expectedStartDay = moment(date).utc().startOf('day').toDate()
    const expectedEndDay = moment(date).utc().endOf('day').toDate()

    const result = getDateRange(date)

    expect(result.startDay).toEqual(expectedStartDay)
    expect(result.endDay).toEqual(expectedEndDay)
  })
})