import { Client, ClientOptions } from '@elastic/elasticsearch'

interface IElasticOrderProduct {
  _id: string,
  sku: string,
  product_id: string,
  price: number,
  base_price: number,
  quantity: number,
  discount_percentage: number,
  manufacturer: string,
  tax_amount: number,
  category: string,
  taxless_price: number,
  unit_discount_amount: number,
  min_price: number,
  discount_amount: number,
  created_on: Date,
  product_name: string,
  taxful_price: number,
  base_unit_price: number
  origin_product_discovery: string
}

interface IElasticOrder {
  category: string[],
  currency: 'BRL' | 'USD',
  customer_first_name: string,
  customer_full_name: string,
  customer_gender: string,
  customer_id: string,
  customer_last_name: string,
  customer_phone: string,
  day_of_week: string,
  day_of_week_i: string,
  email: string,
  manufacturer: string[],
  order_date: Date,
  order_id: string,
  store_id: string
  seller_name: string
  products: IElasticOrderProduct[]
  sku: string[],
  taxful_total_price: number,
  taxless_total_price: number,
  total_quantity: number,
  total_unique_products: number,
  type: string,
}

interface ISaleRecord {
  id: string,
  index: string
  order: IElasticOrder
}

class ElasticPlugin {
  private ElasticClient: Client

  constructor(opts: ClientOptions) {

    this.ElasticClient = new Client(opts)
  }


  createOrderElasticRecord({ id, order, index }: ISaleRecord) {

    return this.ElasticClient.create({
      id,
      index,
      document: order
    })
  }
}

export default ElasticPlugin