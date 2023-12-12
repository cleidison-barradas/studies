interface IAddress {
  street: string
  city: string
  number: number
}
export interface IReturnStoreThatDelivery {
  name: string
  url : string
  address: IAddress
}