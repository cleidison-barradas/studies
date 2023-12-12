import moment from 'moment';
import { specialPrice } from '../helpers/specialPrice'

describe('specialPrice', () => {
  it('returns an empty array if special is zero', () => {
    const result = specialPrice(0, 10)
    expect(result).toEqual([])
  })

  it('returns an empty array if special is greater than price', () => {
    const result = specialPrice(15, 10)
    expect(result).toEqual([])
  })

  it('returns an array with one special price if special is valid', () => {
    const expectedSpecial = {
      price: 5,
      date_start: moment().subtract(1, 'day').startOf('day').toDate(),
      date_end: moment().add(29, 'days').endOf('day').toDate(),
    }
    const result = specialPrice(5, 10)
    expect(result).toEqual([expectedSpecial])
  })
})