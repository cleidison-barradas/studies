/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from 'axios'
import config from '../../../config/versatil'
import { IGetResponse } from './interfaces/IGetResponse'
import { IProductResponse } from '../../../interfaces/IProductResponse'
import { Betwenn } from '../../default/helpers/Betwenn'

// cache
let products: any[] = []
let data: Record<any, any> = null
let totalPages = 1
let currentPage = 1
let cachedProducts: IProductResponse[] = []

const productSchema = {
  price: 'preco',
  name: 'descricao',
  EAN: 'codigo-barras',
  price_prom: 'promocao',
  price_camp: 'preco-campanha',
  laboratory: 'fabricante',
  quantity: 'qtde-disponivel',
}

const client = axios.create({
  baseURL: config.baseUrl,
})

function getProducts(
  token: string,
  page: number
): Promise<AxiosResponse<IGetResponse>> {
  return client.get('/IntegracaoListaProdutos.rule', {
    params: { chave: token, sys: 'WPP', pagina: page },
  })
}

const key = () => {
  return 'versatil'
}

const handle = async (token: string, tenant: string) => {
  try {

    do {
      const response = await getProducts(token, currentPage)

      if (response.data && response.data['erro']) {
        throw new Error(response.data['erro'])
      }

      data = response.data

      if (data) {
        products = data.produtos || []

        const productKeys = Object.keys(productSchema)
        const productValues = Object.values(productSchema)

        products = products.map((product) => {
          const lowerValue: number[] = []

          let obj: Record<string, any> = {}
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

          lowerValue.push(Number(obj['price_prom']), Number(obj['price_camp']))

          const price_prom = lowerValue.filter(value => Number(value) > 0).sort((a, b) => b - a)[0] || 0

          if (price_prom > 0 && price_prom < Number(obj['price'])) {
            obj['erp_pmc'] = Number(obj['price'])
            obj['price'] = price_prom

          } else {

            obj['erp_pmc'] = Number(0)
          }

          delete obj['price_camp']
          delete obj['price_prom']

          return obj
        })

        currentPage = Number(data['pagina'])
        totalPages = Number(data['total-paginas'])

        cachedProducts.push(...products)

        if (currentPage <= totalPages) {
          currentPage = currentPage + 1
        }
      }
    } while (currentPage <= totalPages)

    const loadedProducts = Object.assign([], cachedProducts)
    console.log(`loaded ${loadedProducts.length} products from ${tenant}`)

    console.log(
      JSON.stringify(loadedProducts[Betwenn(0, loadedProducts.length)])
    )

    totalPages = 0
    currentPage = 1
    data = null
    products = []
    cachedProducts = []

    return loadedProducts

  } catch (error) {
    console.log(error)
    data = null
    products = []
    cachedProducts = []
    totalPages = 0
    currentPage = 1

    return cachedProducts
  }
}

export default { key, handle }
