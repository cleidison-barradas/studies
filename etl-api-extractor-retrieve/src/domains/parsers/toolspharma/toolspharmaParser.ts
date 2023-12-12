import axios from 'axios'
import { IGetResponse } from './interfaces/IGetResponse'
import { IProductResponse } from '../../../interfaces/IProductResponse'
import { Betwenn } from '../../default/helpers/Betwenn'
import { IProductType } from '../../../interfaces/IProductDefaultType'

let products: any[] = []
let data: Record<any, any> = null
let currentPag = 1
let totalPag = 1
let cachedProducts: IProductResponse[] = []

const DEFAULT_PRODUCT_TYPE: IProductType = {
  price: {
    type: 'number',
    defaultSeparator: '.'
  },
  specials: {
    type: 'number',
    defaultSeparator: '.'
  },
  discountPercentage: {
    type: 'number',
    defaultSeparator: '.'
  },
  quantity: {
    type: 'number'
  }
}
const productSchema: Record<string, string> = {
  EAN: 'codigoBarras',
  name: 'produto',
  laboratory: 'laboratorio',
  quantity: 'estoque',
  price: 'precoVenda',
  specials: 'descontoPromocaoAtiva',
  discountPercentage: 'descontoCadastro',
}

export function connectToolspharma(baseUrl: string) {
  try {

    if (!baseUrl) throw new Error('base_url_not_provided')

    const client = axios.create({
      baseURL: baseUrl
    })
    if (client instanceof Object) {
      return client
    }
  } catch (error) {
    console.log('connect_error ->', error)
  }
}

export function getProducts(token: string, page: number, baseUrl: string) {

  try {
    if (!token) throw new Error('token_not_provided')
    if (!page) throw new Error('page_not_provided')
    if (!baseUrl) throw new Error('page_not_provided')

    const client = connectToolspharma(baseUrl)
    return client.get<IGetResponse>('/api/v1/produtos', {
      params: { pagina: page },
      'headers': {
        'token': `${token}`
      }
    })
  } catch (error) {
    console.log('getProducts_error ->', error)
  }
}


export const key = () => {
  return 'ToolsPharma'
}


export function parserProducts(data: IGetResponse['list']) {
  try {
    if (!data) throw new Error('data_not_provided')
    products = data
    const productKeys = Object.keys(productSchema)
    const productValues = Object.values(productSchema)


    return products = products
      .filter(product => product.codigoBarras.length > 0 && product.ativo === "1"
        && Number(product.precoVenda) > 0.03)
      .map((product) => {
        let obj: Record<string, any> = {}

        Object.keys(product).forEach((key) => {
          const index = productValues.indexOf(key)

          if (index !== -1) {

            const field = productKeys[index]

            const fieldName = DEFAULT_PRODUCT_TYPE[field]

            if (fieldName) {

              if (product[key] !== fieldName.type && product[key] !== '' && product[key] !== undefined &&
                product[key] !== null) {
                product[key] = fieldName.defaultSeparator ? Number(parseFloat(product[key].toString().replace(/,/g, fieldName.defaultSeparator)).toFixed(2)) : Number(parseInt(product[key]).toFixed(2))
              }
            }

            obj = {
              ...obj,
              [field]: product[key],
            }
          }
        })

        const specials = Number(Number(obj['specials']).toFixed(2)) || 0
        const percentage = Number(Number(obj['discountPercentage']).toFixed(2)) || 0
        const fullPrice = Number(Number(obj['price']).toFixed(2)) || 0

        if (specials > 1 && specials <= 99 && specials > percentage) {
          obj['specials'] = Number(Number(fullPrice - (
            fullPrice * (specials / 100))).toFixed(2))

        } else if (percentage > 1 && percentage <= 99) {
          obj['specials'] = Number(Number(fullPrice - (
            fullPrice * (percentage / 100))).toFixed(2))
        } else {
          obj['specials'] = fullPrice
        }

        delete obj['discountPercentage']

        return obj

      })
  } catch (error) {
    console.log('parser_products_error ->', error)
  }
}

const handle = async (token: string, tenant: string, erpUser?: null, baseUrl?: string) => {
  try {

    do {
      const response = await getProducts(token, currentPag, baseUrl)

      if (response.data && response.data.error) {
        throw new Error(response.data.error.message)
      }
      if (response instanceof Object) {
        data = response.data
        if (data) {
          products = parserProducts(response.data.list)
          currentPag = Number(data.currentPage)
          totalPag = Number(data.totalPages)

          cachedProducts.push(...products)

          if (currentPag <= totalPag) {

            currentPag = currentPag + 1
          }
        }
      }
    } while (currentPag <= totalPag)

    const loadedProducts = Object.assign([], cachedProducts)
    console.log(`loaded ${loadedProducts.length} products from ${tenant}`)

    console.log(
      JSON.stringify(loadedProducts[Betwenn(0, loadedProducts.length)])
    )

    totalPag = 1
    currentPag = 1
    data = null
    products = []
    cachedProducts = []

    return loadedProducts
  } catch (error) {
    console.log(error)
    data = null
    products = []
    cachedProducts = []
    totalPag = 1
    currentPag = 1

    return cachedProducts

  }
}
export default { key, handle }