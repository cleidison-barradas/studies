import { Order, Store } from '@mypharma/api-core'
import SendGridPlugin from '../../../../support/plugins/SendGridPlugin'
import { getCustomerContent } from '../../../../support/helpers/SendGridCustomerContent'
import { getStoreContent } from '../../../../support/helpers/SendGridStoreContent'
import sgMConfig from '../../../../config/sendgrid'
import ElasticPlugin from '../../../../support/plugins/ElasticSearchPlugin'
import elasticConfig from '../../../../config/elastic'

const sendGridPlugin = new SendGridPlugin()

const Elastic = new ElasticPlugin({
  node: elasticConfig.host,
  auth: elasticConfig.auth
})

interface AutomatioNotifierServiceDTO {
  order: Order
  store: Store
}

class AutomatioNotifierService {


  public async notifierAutomation({ order, store }: AutomatioNotifierServiceDTO) {
    const customer = order.customer
    const isRelatedOrderId = !!order?.relatedOrderId
    const orderId = isRelatedOrderId ? order.relatedOrderId.toString() : order._id.toString()

    const { customerEmail, customerOrder, ...templateCustomerData } = getCustomerContent({ customer, isRelatedOrderId, orderId, store })
    const { storeEmail, storeName, ...templateStoreData } = getStoreContent({ store, orderId })

    const bulkSendEmail = sendGridPlugin.getBulkSendEmails()

    bulkSendEmail.push({
      to: customerEmail,
      from: {
        name: storeName,
        email: storeEmail
      },
      dynamicTemplateData: {
        storeName,
        customerOrder,
        ...templateCustomerData,
        ...templateStoreData
      },
      templateId: sgMConfig.sendGridOrderCustomerTemplateId
    })

    bulkSendEmail.push({
      to: storeEmail,
      from: {
        name: 'noreply',
        email: sgMConfig.sendGridUser
      },
      dynamicTemplateData: {
        ...templateStoreData,
      },
      templateId: sgMConfig.sendGridOrderStoreTemplateId
    })

    const sku = order.products.map(orderProduct => orderProduct.product.EAN)

    const products = order.products.map(orderProduct => {

      return {
        base_price: orderProduct.unitaryValue,
        discount_percentage: 0,
        quantity: orderProduct.amount,
        manufacturer: orderProduct.product.manufacturer?.name || 'S/M',
        tax_amount: 0,
        product_id: orderProduct.product._id.toString(),
        category: 'NA',
        sku: orderProduct.product.EAN,
        taxless_price: orderProduct.unitaryValue,
        unit_discount_amount: 0,
        min_price: orderProduct.unitaryValue,
        _id: orderProduct.product._id.toString(),
        discount_amount: orderProduct.promotionalPrice,
        created_on: orderProduct.product.createdAt,
        product_name: orderProduct.product.name,
        price: orderProduct.unitaryValue,
        taxful_price: orderProduct.unitaryValue,
        base_unit_price: orderProduct.unitaryValue,
        origin_product_discovery: orderProduct.origin
      }
    })

    await Elastic.createOrderElasticRecord({
      id: order._id.toString(),
      index: 'mongo_store_ecommerce_sales',
      order: {
        sku,
        type: 'order',
        category: [],
        manufacturer: [],
        day_of_week: '',
        day_of_week_i: '',
        order_id: order._id.toString(),
        store_id: store._id.toString(),
        seller_name: store.name,
        order_date: order.createdAt,
        taxless_total_price: order.totalOrder,
        total_quantity: order.products.length,
        total_unique_products: order.products.length,
        taxful_total_price: order.deliveryData.feePrice,
        customer_gender: '',
        email: customer.email,
        customer_id: customer._id.toString(),
        customer_first_name: customer.firstname,
        customer_last_name: customer.lastname,
        customer_full_name: customer.fullName,
        customer_phone: customer.phone,
        currency: 'BRL',
        products
      }
    })

    return sendGridPlugin.sendMail()

  }
}

export default AutomatioNotifierService