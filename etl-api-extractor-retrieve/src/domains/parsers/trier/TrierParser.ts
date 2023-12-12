import axios, { AxiosInstance } from 'axios'
import { IProductResponse } from '../../../interfaces/IProductResponse'
import { Betwenn } from '../../default/helpers/Betwenn'
import turnCpfRequired from '../../../utils/turnCpfRequired'

// cache
let skip = 0
const take = 999
let products: any[] = []
let cachedProducts: IProductResponse[] = []

const productSchema = {
  price: 'valorVenda',
  name: 'nome',
  EAN: 'codigoBarras',
  specials: 'percentualDesconto',
  laboratory: 'nomeLaboratorio',
  quantity: 'quantidadeEstoque',
  sku: 'codigo'
}

let client: AxiosInstance

function connectTrier(baseURL: string) {
  client = axios.create({
    baseURL
  })
}

// Trier integration requires

async function getProducts(token: string) {
  try {
    return client.get('/rest/integracao/produto/obter-todos-v1', {
      params: { primeiroRegistro: skip, quantidadeRegistros: take },
      'headers': {
        'Authorization': `Bearer ${token}`
      }
    })

  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

const key = () => {
  return 'trier'
}

const handle = async (token: string, tenant: string, erpUser: null, baseUrl: string) => {
  try {
    let length = 0
    connectTrier(baseUrl)
    await turnCpfRequired(tenant)

    do {
      const response = await getProducts(token)

      if (response.data && response.data['erro']) {
        throw new Error(response.data['erro'])
      }

      products = response.data

      if (products.length > 0) {

        const productKeys = Object.keys(productSchema)
        const productValues = Object.values(productSchema)

        products = products
          .filter(product => product.codigoBarras && product.integracaoEcommerce &&
            Number(product.valorVenda) > 0.03)
          .map(product => {

            let obj: Record<any, any> = {}
            Object.keys(product).forEach((key) => {
              const index = productValues.indexOf(key)
              if (index !== -1) {
                const field = productKeys[index]

                obj = {
                  ...obj,
                  [field]: product[key],
                }
              }
            })

            const percentage = Number(Number(obj['specials']).toFixed(2)) || 0
            const fullPrice = Number(Number(obj['price']).toFixed(2)) || 0

            if (percentage > 1 && percentage <= 99) {
              obj['specials'] = Number(Number(fullPrice -
                (fullPrice * (percentage / 100))).toFixed(2))
            } else {
              obj['specials'] = fullPrice
            }

            return obj
          })

        skip = (skip + take)

        cachedProducts.push(...products)
      }

      length = 0
      length = products.length
      products = []
    } while (length > 0)

    const loadedProducts = Object.assign([], cachedProducts)

    console.log(`loaded ${loadedProducts.length} products from ${tenant}`)

    console.log(
      JSON.stringify(loadedProducts[Betwenn(0, loadedProducts.length)])
    )

    skip = 0
    products = []
    cachedProducts = []

    return loadedProducts

  } catch (error) {
    console.log(error)
    skip = 0
    products = []
    cachedProducts = []

    return cachedProducts
  }
}

export default { key, handle }
