import setOptionsOrConditions from '../helpers/setOptionsOrConditions'
import storesMock from './mocks/store.mock'


describe('Test data filter', () => {
  test('filters stores who was created on 2022-12-04 to 2022-12-12', () => {
    const stores = storesMock

    const result = stores[0]

    const dateStart = new Date('2022-12-04T03:00:00.000Z')
    const dateEnd = new Date('2022-12-12T03:00:00.000Z')

    const expected = setOptionsOrConditions(stores, dateStart, dateEnd)

    expect(expected[0].createdAt).toBe(result.createdAt)
  })

  test('filters stores who was not created on 2022-12-04 to 2022-12-12', () => {
    const stores = storesMock

    const dateStart = new Date('2022-01-01T03:00:00.000Z')
    const dateEnd = new Date('2022-01-02T03:00:00.000Z')

    const expected = setOptionsOrConditions(stores, dateStart, dateEnd)

    expect(expected.length).toBe(0)
  })
})

