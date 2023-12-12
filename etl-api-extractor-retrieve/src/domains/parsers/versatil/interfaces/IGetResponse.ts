
interface IProductsResponse {
  preco: number
  promocao: number
  descricao: string
  fabricante: string
  'codigo-barras': string
  'preco-campanha': number
  'qtde-disponivel': number
  [key: string]: any
}

export interface IGetResponse {
  erro?: string,
  pagina: number
  'total-paginas': number
  produtos: IProductsResponse[],
  [key: string]: any
}
