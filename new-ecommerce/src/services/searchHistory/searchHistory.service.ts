import Product from '../../interfaces/product'
import { StorageKeys } from '../../config/keys'
import { ISearchHistory } from '../../interfaces/searchHistory'
import { loadStorage, saveStorage } from '../storage/storage.service'

const LIMIT_STORED: number = 10

/**
 * It saves a product to the local storage
 * @param {Product} product - Product - The product that we want to save in the history
 */
export function saveProductHistory(product: Product) {
  const _productHistory: ISearchHistory['productHistory'] = []
  const history = loadStorage<ISearchHistory>(StorageKeys.search)

  if (!history || !history.productHistory) {
    _productHistory.push(product)

    return saveStorage(StorageKeys.search, {
      ...history,
      productHistory: _productHistory
    })
  }


  if (history.productHistory.filter(_product => _product._id?.includes(product._id)).length <= 0) {
    const { productHistory } = history

    if (productHistory.length === LIMIT_STORED) {
      productHistory.splice(productHistory.length - 1, 1)
    }

    productHistory.push(product)

    return saveStorage(StorageKeys.search, {
      ...history,
      productHistory
    })
  }
}

/**
 * It saves the query to the local storage if it doesn't exist
 * @param {string} query - string - The query string that we want to save in the history.
 * @returns the result of the saveStorage function.
 */
export function saveQueryHistory(query: string) {
  const _queryHistory: ISearchHistory['queryHistory'] = []
  const history = loadStorage<ISearchHistory>(StorageKeys.search)

  if (!history || !history.queryHistory) {
    _queryHistory.push(query)

    return saveStorage(StorageKeys.search, {
      ...history,
      queryHistory: _queryHistory
    })
  }

  if (!history.queryHistory.includes(query)) {
    const { queryHistory } = history

    if (queryHistory.length === LIMIT_STORED) {
      queryHistory.splice(queryHistory.length - 1, 1)
    }

    queryHistory.push(query)

    return saveStorage(StorageKeys.search, {
      ...history,
      queryHistory
    })
  }
}

/**
 * It removes a query from the query history
 * @param {string} query - string - The query to remove from the history
 * @returns A function that takes a query and removes it from the queryHistory array.
 */
export function removeQueryHistory(query: string) {
  const history = loadStorage<ISearchHistory>(StorageKeys.search)

  if (history && history.queryHistory) {
    const { queryHistory } = history
    const index = queryHistory.findIndex(_query => _query.includes(query))
    queryHistory.splice(index, 1)

    return saveStorage(StorageKeys.search, {
      ...history,
      queryHistory
    })
  }
}

/**
 * It removes a product from the product history
 * @param {string} _id - string - The product id
 * @returns the result of the saveStorage function.
 */
export function removeProductHistory(_id: string) {
  const history = loadStorage<ISearchHistory>(StorageKeys.search)

  if (history && history.productHistory) {
    const { productHistory } = history
    const index = productHistory.findIndex(_product => _product._id.includes(_id))
    productHistory.splice(index, 1)

    return saveStorage(StorageKeys.search, {
      ...history,
      productHistory
    })
  }
}
