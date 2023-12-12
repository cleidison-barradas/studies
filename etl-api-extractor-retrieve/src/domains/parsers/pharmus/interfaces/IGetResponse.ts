interface ProductResponse {
  id: string
  nome: string
  preco: number
  barra: string
  estoque: string
  grupoId: string
  subGrupoId: string
  fabricante: string
  precoBruto: number
  apresentacao: string
  fabricanteId: string
}

export interface IGetResponse {
  mensagem?: string
  exception?: string
  status: 'OK' | 'ERROR'
  objeto: {
    produto: ProductResponse[]
  }
}
