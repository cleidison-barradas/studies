const removeDuplicates = require('../utils/removeDuplicates')

describe('removeDuplicates', () => {
  it('should remove duplicate products and return a new list without duplicates', () => {
    const products = [
      { EAN: '1234567890', name: 'Product A' },
      { EAN: '9876543210', name: 'Product B' },
      { EAN: '1234567890', name: 'Product A' },
      { EAN: '1111111111', name: 'Product C' },
      { EAN: '9876543210', name: 'Product B' },
    ]

    const expectedFilteredProducts = [
      { EAN: '1234567890', name: 'Product A' },
      { EAN: '9876543210', name: 'Product B' },
      { EAN: '1111111111', name: 'Product C' },
    ]

    expect(removeDuplicates(products)).toEqual(expectedFilteredProducts)
  })

  it('should return a new empty list when there are no products', () => {
    const products = []

    const expectedFilteredProducts = []

    expect(removeDuplicates(products)).toEqual(expectedFilteredProducts)
  })

  it('should return the same list when there are no duplicate products', () => {
    const products = [
      { EAN: '1234567890', name: 'Product A' },
      { EAN: '9876543210', name: 'Product B' },
      { EAN: '1111111111', name: 'Product C' },
    ]

    const expectedFilteredProducts = [
      { EAN: '1234567890', name: 'Product A' },
      { EAN: '9876543210', name: 'Product B' },
      { EAN: '1111111111', name: 'Product C' },
    ]

    expect(removeDuplicates(products)).toEqual(expectedFilteredProducts)
  })
})

