import axios, { AxiosResponse } from 'axios'
import config from '../../../config/pharmus'
import { IProductType } from '../../../interfaces/IProductDefaultType'
import { IProductResponse } from '../../../interfaces/IProductResponse'
import { Betwenn } from '../../default/helpers/Betwenn'
import { IGetResponse } from './interfaces/IGetResponse'

let products: any[] = []
let data: Record<any, any> = null
let cachedProducts: IProductResponse[] = []

const DEFAULT_PRODUCT_TYPE: IProductType = {
  price: {
    type: 'number',
    defaultSeparator: '.'
  },
  erp_pmc: {
    type: 'number',
    defaultSeparator: '.'
  },
  quantity: {
    type: 'number'
  }
}

const productSchema = {
  name: 'nome',
  EAN: 'barra',
  price: 'preco',
  quantity: 'estoque',
  erp_pmc: 'precoBruto',
  laboratory: 'fabricante',
  presentation: 'apresentacao',
}

const client = axios.create({
  baseURL: config.baseUrl,
})

const getProducts = async (token: string, erpUser: string): Promise<AxiosResponse<IGetResponse>> =>
  await client.get('/produto/lista', {
    params: {
      usuario: erpUser,
      empresa: token,
      desenvolviment: config.desenvolvimento,
    },
  })

const key = () => {
  return 'pharmus'
}

const handle = async (token: string, tenant?: string, erpUser?: string) => {
  try {
    const response = await getProducts(token, erpUser)

    data = response.data

    if (data['status'] === 'ERROR') {
      throw new Error(data.mensagem)
    }
    products = data.objeto['produto']

    const productKeys = Object.keys(productSchema)
    const productValues = Object.values(productSchema)

    products = products.map(product => {
      let obj: Record<any, any> = {}
      Object.keys(product).forEach(key => {
        const index = productValues.indexOf(key)

        if (index !== -1) {
          const field = productKeys[index]
          const fieldName = DEFAULT_PRODUCT_TYPE[field]

          if (fieldName) {
            if (typeof product[key] !== fieldName.type) {
              product[key] = fieldName.defaultSeparator ? parseFloat(product[key].toString().replace(/,/g, fieldName.defaultSeparator)) : parseInt(product[key])
            }
          }

          obj = {
            ...obj,
            [field]: product[key]
          }
        }
      })

      return obj
    })

    cachedProducts.push(...products)

    const loadedProducts = Object.assign([], cachedProducts)
    data = null
    products = []
    cachedProducts = []

    console.log(`loaded ${loadedProducts.length} products on ${tenant}`)

    console.log(JSON.stringify(loadedProducts[Betwenn(0, loadedProducts.length)]))

    return loadedProducts

  } catch (error) {
    console.log(error)

    data = null
    products = []
    cachedProducts = []

    return cachedProducts
  }
}

export default {
  key,
  handle,
}
