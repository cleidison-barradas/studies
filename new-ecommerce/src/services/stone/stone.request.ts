import { BasicOrderProps } from '../order/request.interface'

export interface GetStoneTokenRequest {
  number: string
  name: string
  cvv: string
  expireDate: string
}

export interface CreateBoletoOrderRequest extends BasicOrderProps {
  cpf: string
}
