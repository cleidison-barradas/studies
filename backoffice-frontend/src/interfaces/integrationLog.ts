interface GenericObj {
  [key: string]: any
}

export default interface IntegrationLog {
  _id?: string
  status: string
  lastSeen: Date
  erpName: string
  storeUrl: string
  storeName: string
  extras: GenericObj
}
