interface IProductsResponse {
   idProduto: string
   codigoBarras: string
   produto: string
   idLaboratorio?: string
   laboratorio: string
   idGrupoProduto: string
   grupoProduto: string
   idSubGrupoProduto: string
   subGrupoProduto: string
   idCategoria: string
   categoria: string
   estoque: string
   precoFabrica: string
   precoVenda: string
   descontoCadastro: string
   descontoPromocaoAtiva: string
   quantidadePromocaoPorQuantidadeLimitada: string
   descontoPromocaoPorQuantidadeLimitada: string
   quantidadePromocaoPorQuantidade: string
   descontoPromocaoPorQuantidade: string
   ativo: string
   valorPMC: string
}

interface IErrorResponse {
   message: string
}
export interface IGetResponse {
   error?: IErrorResponse
   'list': IProductsResponse[]
   currentPage: number
   'totalPages': number
   records: number
   recordCount: number
}
