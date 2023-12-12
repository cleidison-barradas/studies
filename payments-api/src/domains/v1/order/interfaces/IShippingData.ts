export default interface IShippingData {
  id: number
  name: string
  price: number
  custom_price: number
  discount: number
  currency: string
  delivery_time: number
  delivery_range: {
    min: number
    max: number
  }
  custom_delivery_time: number
  custom_delivery_range: {
    min: number
    max: number
  }
  packages: [
    {
      format: string
      dimensions: {
        height: number
        width: number
        length: number
      }
      weight: number
      insurance_value: number
      products: [
        {
          id: string
          quantity: number
        }
      ]
    }
  ]
  additional_services: {
    receipt: boolean
    own_hand: boolean
    collect: boolean
  }
  company: {
    id: 2
    name: string
    picture: string
  }
}
