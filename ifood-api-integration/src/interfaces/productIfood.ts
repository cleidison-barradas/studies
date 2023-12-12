export interface IFoodProducts {
  plu: string,
  nome: string,
  valor: number,
  ativo: boolean,
  idLoja: string,
  imageURL: string,
  codigoBarra: string,
  marca: string,
  categoria?: string,
  departamento: string,
  unidade?: string
  volume?: string
  valorAtacado?: number
  valorCompra?: number
  subCategoria?: string,
  valorPromocao: number,
  descricao: string,
  quantidadeEstoqueAtual: number,
  quantidadeEstoqueMinimo?: number,
  quantidadeAtacado?: number,
}