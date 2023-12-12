import { Product } from "@mypharma/api-core"
import { IFoodProducts } from "../../../interfaces/productIfood"
import { getActiveSpecialPrice } from "../../../utils/specialPrice"

/**
 * It compares two arrays of objects and returns a new array of objects that are different
 * @param {Product[]} products - Product[]
 * @param {IFoodProducts[]} compare - IFoodProducts[]
 */
export const productDelta = (products: Product[] = [], compare: IFoodProducts[]) => {
  if (!products || products.length === 0) return []
  const delta = new Map<string, Product>([])

  products.forEach((_product) => {
    _product.quantity = Number(_product.quantity) < 0 ? 0 : Number(_product.quantity)

    const product = compare.find(
      (x) => x.codigoBarra.toString() === _product.EAN.toString()
    )

    if (!product) {

      if (!delta.has(_product.EAN)) delta.set(_product.EAN, _product)

    } else {

      const special = getActiveSpecialPrice(_product.specials)

      if (
        _product.name !== product.nome ||
        Number(_product.price) !== Number(product.valor) ||
        Boolean(_product.status) !== Boolean(product.ativo) ||
        Number(_product.quantity) !== Number(product.quantidadeEstoqueAtual) ||
        (special && Number(special.price) !== Number(product.valorPromocao))) {

        if (!delta.has(_product.EAN)) {
          delta.set(_product.EAN, _product)
        }
      }
    }
  })

  const filtred = Array.from(delta.values())

  delta.clear()

  return filtred
}
