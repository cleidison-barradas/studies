export interface IFoodReport {
  label: string
  value: string
}

export interface IFoodOrder {
  ifoodCode: string
  ifoodId: string
  status: string
  price: number
  partnerCode: string
}

export interface IFoodProduct {
  id: number
  index: number
  codigo: string
  codigoLoja: string
  pesoVariavel: boolean
  codigoBarra: string
  plu: string
  produto: string
  quantidade: number
  quantidade3: number
  valor: number
  valorTotal: number
  indisponivel: boolean
  desistencia: boolean
}

export interface IFoodDetail {
  idLoja: number
  idCliente: number
  codigo: string
  codigoLoja: string
  data: Date | string
  hora: string
  dataHora: Date | string
  agendamentoDataInicio: Date | string
  agendamentoHoraInicio: Date | string
  agendamentoDataFim: Date | string
  agendamentoHoraFim: Date | string
  entrega: boolean
  cpfNaNota: boolean
  status: string
  statusDescricao: string
  pessoaAutorizadaRecebimento: string
  quantidadeItemUnico: number
  valorMercado: number
  valorConveniencia: number
  valorEntrega: number
  valorRetirada: number
  valorTroco: number
  valorDesconto: number
  valorTotal: number
  valorCorrigido: number
  parceiro: {
    codigoEntrega: string
    codigoPedido: string
  }
  plataforma: any[]
  enderecoEntrega: {
    id: number
    logradouro: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    uf: string
    estado: string
    cep: string
    latitude: number
    longitude: number
  }
  loja: {
    id: number
    nome: string
    cnpj: string
    status: boolean
    endereco: {
      logradouro: string
      numero: string
      bairro: string
      cidade: string
      uf: string
      estado: string
      cep: string
    }
    rede: {
      id: number
      nome: string
    }
  }
  cliente: {
    id: number
    nome: string
    email: string
    cpf: string
    cnpj: string
    tipo: boolean
    publicidadeEmail: boolean
    publicidadeSms: boolean
    telefoneCelular: string
    enderecos: any[]
  }
  items: IFoodProduct[]
  pagamentos: [
    {
      id: number
      nome: string
      valor: number
      tipo: any[]
      transacoes: any[]
    }
  ]
}
