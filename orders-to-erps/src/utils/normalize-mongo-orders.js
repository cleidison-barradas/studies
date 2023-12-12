const moment = require('moment')

const order = {
  cpf: 'cpf',
  order_id: '_id',
  platform: 'prefix',
  comment: "comment",
  total: "totalOrder",
  customer: 'customer',
  orderProducts: "products",
  deliveryData: "deliveryData",
  orderTotals: "orderTotals",
  deliveryData: "deliveryData",
  orderStatus: "statusOrder",
  money_change: "moneyChange",
  payment_code: "paymentCode",
  delivery_mode: "deliveryMode",
  deliveryMode: 'deliveryMode',
  paymentCode: 'paymentCode',
  paymentOrder: "paymentMethod",
  healthInsurance: 'healthInsurance',
  date_added: "createdAt",
  date_updated: "updatedAt",
}

const deliveryModeText = {
  store_pickup: 'Retirar na loja',
  own_delivery: 'Entrega local',
  shipping_company: 'Envio por transportadora',
}

const normalizeAddress = (addresses = []) => {
  if (addresses.length === 0) {
    return {
      withdraw_in_store: true,
      shipping_address_1: '',
      shipping_complement: '',
      shipping_address_2: '',
      shipping_city: '',
      shipping_number: 'S/N',
      shipping_postcode: '',
      shipping_zone: '',
      shipping_country: ''
    }
  }

  const address = addresses[addresses.length - 1] || {}

  if (typeof address !== 'object' || address === null || Object.keys(address).length === 0) {
    return {
      withdraw_in_store: true,
      shipping_address_1: '',
      shipping_complement: '',
      shipping_address_2: '',
      shipping_city: '',
      shipping_number: 'S/N',
      shipping_postcode: '',
      shipping_zone: '',
      shipping_country: ''
    }
  }

  const { neighborhood = {}, street = '', complement = '', postcode = '', number = 'S/N' } = address
  const { name, city = {} } = neighborhood

  const normalizeString = (str) => {
    if (typeof str === 'string') {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    } else {
      return String(str).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    }
    
    return ''
  }

  const shipping_address_1 = normalizeString(street)
  const shipping_complement = normalizeString(complement)
  const shipping_address_2 = normalizeString(name)
  const shipping_city = normalizeString(city.name)
  const shipping_number = normalizeString(number) || 'S/N'
  const shipping_postcode = (postcode && typeof postcode === 'string') ? postcode.replace(/\D+/g, '') :
    postcode ? String(postcode).replace(/\+/g, '') : ''
  const shipping_zone = normalizeString(city.state?.name)
  const shipping_country = normalizeString(city.state?.country?.name)
  return {
    shipping_address_1,
    shipping_complement,
    shipping_address_2,
    shipping_city,
    shipping_number,
    shipping_postcode,
    shipping_zone,
    shipping_country,
    withdraw_in_store: false
  }
}

const normalizeCustomer = (customer = null, cpf = '') => {
  if (!customer) {
    return null
  }

  const { firstname, lastname, email, phone, addresses = [] } = customer

  return {
    firstname: firstname ? firstname : '',
    lastname: lastname ? lastname : '',
    email: email ? email : '',
    telephone: phone ? phone : '',
    cpf: customer.cpf || cpf || '',
    address: addresses ? normalizeAddress(addresses) : null
  }
}

const normalizeOrderProducts = (products = []) => {
  if (products.length === 0) {
    return []
  }

  return products.map(item => {
    const { product, unitaryValue, promotionalPrice, amount } = item
    const price = (Number(promotionalPrice) < Number(unitaryValue)) ? Number(promotionalPrice) : Number(unitaryValue)
    const total = (price * amount).toFixed(2)

    return {
      model: product.name,
      quantity: amount,
      price: price.toFixed(2),
      total,
      product: {
        ean: product.EAN,
        ms: product.MS || null,
        sku: product.sku || null
      }
    }
  })
}

const normalizeOrderStatus = (status = null) => {
  if (!status) {
    return null
  }

  return {
    order_status_id: status.originalId,
    name: status.name
  }
}


const normalizePayment = (payment = null, healthInsurance = 'Nome da Empresa não especificado', platform = 'ecommerce') => {
  if (platform && platform.toLowerCase().includes('ifood')) {
    return {
      name: 'Pago pela plataforma Ifood',
      type: 'ifood'
    }
  }

  if (!payment || !payment.paymentOption) {
    return null
  }

  const { paymentOption: { name, type }, details } = payment

  let installments = 1

  if (details?.payment_installments) {
    installments = details.payment_installments
  }

  if (type?.includes('covenant')) {
    return {
      name: healthInsurance,
      type,
      installments
    }
  }

  return {
    name,
    type,
    installments
  }
}

const normalizeOrderTotals = (deliveryData = null, total) => {
  const feePrice = deliveryData?.feePrice || 0

  const newOrderTotals = [
    {
      code: 'sub_total',
      title: 'Sub-total',
      value: Number(total) - Number(feePrice),
    },
    {
      code: 'total',
      title: 'Total',
      value: Number(total),
    },
    {
      code: 'shipping',
      title: 'Frete',
      value: Number(feePrice),
    },
  ]

  return newOrderTotals
}

const normalizePaymentCode = (paymentCode = '', deliveryMode = '') => {
  let paymentCodeText = ''

  if (deliveryMode === 'store_pickup' && paymentCode === 'pay_on_delivery') {
    paymentCodeText = 'Pagamento na retirada'
    return paymentCodeText
  }

  if (paymentCode === 'pay_on_delivery') {
    paymentCodeText = 'Pagamento na entrega'
    return paymentCodeText
  }

  if (paymentCode === 'pay_online') {
    paymentCodeText = 'Pagamento online'
    return paymentCodeText
  }

  return ''
}

const parsePlatform = (platform = 'ecommerce') => platform
const parserOrders = (orders = [], store) => {
  let parsedOrders = []

  const orderKeys = Object.keys(order)
  const orderValues = Object.values(order)

  parsedOrders = orders.map(item => {

    let obj = {}

    Object.keys(item).forEach(key => {

      const index = orderValues.indexOf(key)

      if (index !== -1) {
        const field = orderKeys[index]

        obj = {
          ...obj,
          [field]: item[key]
        }
      }
    })

    return obj
  })

  parsedOrders = parsedOrders.map(x => {
    const storeName = store && store.name ? store.name : ''
    const storeUrl = store && store.url ? store.url : ''
    return {
      order_id: x.order_id || 1,
      platform: parsePlatform(x.platform),
      date_added: moment(x.date_added).utc(true).toDate() || null,
      date_updated: moment(x.date_updated).utc(true).toDate() || null,
      total: Number(Number(x.total).toFixed(2)) || 0.00,
      orderTotals: normalizeOrderTotals(x.deliveryData, x.total),
      money_change: x.money_change || 0.00,
      payment_code: normalizePaymentCode(x.payment_code, x.delivery_mode),
      payment_method: normalizePaymentCode(x.payment_code, x.delivery_mode),
      delivery_mode: deliveryModeText[x.delivery_mode] || '',
      comment: x.comment || '',
      store_name: storeName,
      store_url: storeUrl,
      customer: normalizeCustomer(x.customer, x.cpf),
      paymentOrder: normalizePayment(x.paymentOrder, x.healthInsurance, x.platform),
      orderStatus: normalizeOrderStatus(x.orderStatus),
      orderProducts: normalizeOrderProducts(x.orderProducts)
    }
  })

  const parsed = Object.assign([], parsedOrders)
  parsedOrders = []

  return parsed
}

module.exports = {
  parserOrders,
  normalizeAddress,
  normalizeCustomer,
  normalizeOrderProducts,
  normalizeOrderStatus,
  normalizeOrderTotals,
  normalizePayment,
  normalizePaymentCode
}
