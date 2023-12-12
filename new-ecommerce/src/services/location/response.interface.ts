interface IAddress {
    street: string
    city: string
    number: number
}

export interface IReturnStoreThatDelivery {
    name: string
    url: string
    address: IAddress
    storeName: string
    storeUrl: string
    label?: string
    storeAddress: IAddress
    distance: number
}

export interface GetStoresByCEP {
    groups: IReturnStoreThatDelivery[]
    match: boolean
}