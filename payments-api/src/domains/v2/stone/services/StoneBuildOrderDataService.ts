import { Customer, DeliveryFee, DistanceDeliveryFee, OrderProducts } from '@mypharma/api-core'
import { StoneCreditCardData, StoneCustomerOrderData, StonePaymentType, StoneTiketData } from '../../../../support/interfaces/stone.plugin'

interface StoneBuildOrderDataServiceDTO {
  cpf: string
  customer: Customer
  totalOrder?: number
  boleto?: StoneTiketData
  deliveryData: DeliveryFee | DistanceDeliveryFee
  products: OrderProducts[]
  credit_card?: StoneCreditCardData
  payment_method: StonePaymentType
  originalId?: number
  selectedInstallment?: any
}

class StoneBuildOrderDataService {
  constructor(private repository?: any) { }

  public async buildOrderFields({
    customer,
    cpf,
    boleto,
    credit_card,
    deliveryData,
    products,
    payment_method = 'boleto',
    originalId,
    selectedInstallment
  }: StoneBuildOrderDataServiceDTO) {
    const { email, phone, addresses = [] } = customer
    if (!addresses || addresses.length <= 0) {
      throw new Error('missing_address_stone_method')
    }

    const address = addresses[0]

    const name = customer.fullName
    const zip_code = address.postcode ? address.postcode.replace(/\D/g, '') : '85801090'
    const document = customer.cpf && customer.cpf.length > 0 ? customer.cpf.replace(/\D/g, '') : cpf.replace(/\D/g, '')
    const customerPhone = /([0-9]{2})([0-9]{7,9})/.exec(phone.replace(/\D/g, ''))

    const city = address.neighborhood.city.name
    const state = address.neighborhood.city.state.code
    const line_1 = `${address.number},${address.street},${address.neighborhood.name}`
    const feePrice = Math.floor(Number(deliveryData.feePrice) * 100)

    const items = products.map((_product) => {
      const quantity = _product.amount
      const description = _product.product.name
      const amount =
        _product.promotionalPrice < _product.unitaryValue
          ? Math.floor(Number(_product.promotionalPrice) * 100)
          : Math.floor(Number(_product.unitaryValue) * 100)

      return {
        amount,
        quantity,
        description,
      }
    })

    if (selectedInstallment.hasFee && selectedInstallment.feeValue) {
      const feeItem = {
        amount: selectedInstallment.feeValue * 100,
        quantity: 1,
        description: 'Taxa de Parcelamento'
      }

      items.push(feeItem)
    }

    if (payment_method === 'credit_card') {
      credit_card['card'].billing_address = {
        city,
        state,
        line_1,
        zip_code,
        country: 'BR',
      }
    }

    const form: StoneCustomerOrderData = {
      items,
      customer: {
        name,
        email,
        document,
        type: 'individual',
        document_type: 'CPF',
        phones: {
          mobile_phone: {
            country_code: '55',
            number: customerPhone[0].replace(/[^0-9]/g, '').substring(2, 11),
            area_code: customerPhone[1],
          },
        },
        address: {
          city,
          state,
          line_1,
          zip_code,
          country: 'BR',
        },
      },
      antifraud_enabled: true,
      device: { platform: '' },
      payments: [
        {
          boleto,
          credit_card,
          payment_method,
        },
      ],
      shipping: {
        amount: feePrice,
        description: String(originalId),
        recipient_name: name,
        recipient_phone: customerPhone[0],
        address: {
          city,
          state,
          line_1,
          zip_code,
          country: 'BR',
        },
      },
    }

    return form
  }
}

export default StoneBuildOrderDataService
