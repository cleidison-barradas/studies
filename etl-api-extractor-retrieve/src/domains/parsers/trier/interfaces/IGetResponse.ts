
interface IProductsResponse {
  valorVenda: number,
  nome: string,
  codigoBarras: number,
  percentualDesconto: number,
  nomeLaboratorio: string,
  quantidadeEstoque: number
  [key: string]: any

}
  
export interface IGetResponse {
  erro?: string,
  pagina: number
  'total-paginas': number
  produtos: IProductsResponse[],
  [key: string]: any
}
  