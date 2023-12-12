export type ITypeIfoodQueue = 'ifood_sync_products_' | 'ifood_reset_products_'

export type IIFoodKeyService = 'ifood_sync_order_'

export type IIFoodStatus = 'CAN' | 'DEV' | 'EMI' | 'FIN' | 'REP' | 'RET' | 'ENP' | 'ENT' | 'SEP' | 'APA' | 'PE0' | 'PE1'

export type IPlatform = 'SM' | 'MMC' | 'IFOOD'

export interface IIFoodOrder {
  id: number,
  codigoPedido: string,
  status: IIFoodStatus,
  idLoja: number
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

export interface IIFoodDeliveryAddress {
  id: number
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  uf: string
  estado: string
  cep: string
  latitude: string
  longitude: string
}

export interface IIFoodClient {
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

interface IIFoodPayments {
  id: number
  nome: string
  valor: number
  tipo: any[]
  transacoes: any[]
}

export interface IIFoodOrderDetail {
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
  status: IIFoodStatus
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
  plataforma: IPlatform
  enderecoEntrega: IIFoodDeliveryAddress
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
  cliente: IIFoodClient
  items: IFoodProduct[]
  pagamentos: IIFoodPayments[]
}