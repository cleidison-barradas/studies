import { Product, Store } from "@mypharma/api-core";
import { getProductPMC } from "../../../utils/pmcProduct";
import { getActiveSpecialPrice } from "../../../utils/specialPrice";
import { IFoodProducts } from "../../../interfaces/productIfood";

const IFOOD_PRODUCT_SHCHEMA: Record<string, string> = {
  nome: 'name',
  valor: 'price',
  ativo: 'status',
  idLoja: 'storeId',
  codigoBarra: 'EAN',
  descricao: 'presentation',
  quantidadeEstoqueAtual: 'quantity',
}

interface IParserParams {
  store: Store
  storeId: string
  products: Product[]
}


export const parser = ({ products = [], store, storeId }: IParserParams) => {

  if (products.length === 0) return []
  const data = new Map<string, IFoodProducts>([])

  const schemaKeys = Object.keys(IFOOD_PRODUCT_SHCHEMA)
  const schemaValues = Object.values(IFOOD_PRODUCT_SHCHEMA)


  products.forEach(product => {
    let obj: IFoodProducts | null = null

    Object.keys(product).forEach(key => {
      const index = schemaValues.indexOf(key)

      if (index !== -1) {
        const field = schemaKeys[index]

        obj = {
          ...obj,
          [field]: product[key]
        }
      }
    })

    obj['marca'] = ''
    obj['idLoja'] = storeId
    obj['plu'] = product.EAN
    obj['departamento'] = 'Farmácia'
    obj['categoria'] = 'Farmácia'

    if (product.image) {

      obj['imageURL'] = new URL(product.image.url, process.env.S3_BUCKET).href
    }

    if (Number(obj['quantidadeEstoqueAtual']) < 0) {
      obj['quantidadeEstoqueAtual'] = 0
    }

    const special = getActiveSpecialPrice(product.specials)

    if (special) {

      obj['valorPromocao'] = special.price

    } else {

      const pmc = getProductPMC(product, store)

      if (pmc) {
        obj['valor'] = Number(pmc)
        obj['valorPromocao'] = Number(product.price)

      } else {

        delete obj['valorPromocao']
      }
    }

    if (!data.has(obj.codigoBarra)) {
      data.set(obj.codigoBarra, obj)
    }
  })

  const parsedProducts = Array.from(data.values())
  data.clear()

  return parsedProducts
}