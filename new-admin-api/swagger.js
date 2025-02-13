require('dotenv').config()
const swaggerAutogen = require('swagger-autogen')()

const endpointsFiles = ['./src/http/routes'];

const doc = {
  info: {
    version: "1.0.0",
    title: "My API",
    description: "Documentation automatically generated by the <b>swagger.autogen</b> module."
  },
  host: "localhost:3333",
  basePath: "/",
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      "name": "AboutUs",
      "description": "Endpoints"
    },
    {
      "name": "Category",
      "description": "Endpoints"
    },
  ],
}

const outputFile = './swagger-output.json'

swaggerAutogen(outputFile, endpointsFiles, doc)

/**
 * require('dotenv/config')
const { ORM, ProductRepository, StoreRepository, OrderRepository } = require('@mypharma/api-core')
const ObjectsToCsv = require('objects-to-csv')
const { databases } = require('../config')
const { AWS_S3_URL } = process.env
const path = require('path')
const moment = require('moment')
 
exports.default = (async () => {
  ORM.config = databases.mongoConfig
  await ORM.setup()
  const report = []
  const allOrders = []
  let initalMounth = 1
  let quantity_offers = 0
  const fileName = 'store-info.csv'
  const dir = path.resolve(__dirname, '..', 'tmp', fileName)
 
  let products = await ProductRepository.repo().find({
    where: {
      imageUrl: { $nin: [null, ''] },
      image: { $ne: null }
    }
  })
 
  products = products.filter(p => !p.imageUrl.includes('mockups'))
 
  console.log(products[0], products.length)
 
  const csvFile = new ObjectsToCsv(report)
  await csvFile.toDisk(dir, { append: true })
  initalMounth = 1
  process.exit(0)
})()
 
 
/**
 *   const order_status_rejected = ['rejected', 'reversed']
  const order_status_pending = ['pending']
 
  const data = [
    '14485489000810', '02207068000171', '18670724000108', '08668349000108',
    '24095796000171', '28750999000105', '40047636000103', '39971756000113',
    '29170284000146', '04173405000182', '31987477000136', '61869608000141',
    '11362596000196', '27234801000178', '07377055000164', '05699153000192',
    '61349700000180', '04788925000108', '11844361000130', '31700225000184',
    '40738930000161', '15107692000149', '37755701000140', '23672509000186',
    '85035327000313', '85035327000402', '12698879000176', '39648086000107',
    '28663826000150', '11454537000148', '09011669000153', '12509944000178',
    '34092564000113', '11790016000161', '85035327001042', '07409547000194',
    '48487391000147', '33889770000196', '25062790000160', '53126207000173',
    '09204453000104', '23044121000130', '20140394000190', '36877141000134',
    '13547175000165', '65283392000199', '11087298000135', '29601779000182',
    '01928328000135', '58852971000140', '23965938000141', '82787276000126',
    '43608150000195', '10294743000175', '01707026000137', '40631463000176',
    '06865409000157', '84039031000146', '22967585000156', '40978060000106',
    '29596751000102', '37831859000152', '24958011000147', '40204396000103',
    '43695376000170', '42641404000104', '91382325000131', '04965393000129',
    '16831840000136', '09330113000120', '37192820000132', '01326211000181',
    '37267095000114', '40333489000138', '25246096000101', '25246096000284',
    '24958011000228', '25251709000433', '21268121000199', '17982904000162',
    '13134532000163', '11891552000153'
  ]
 
  let stores = await StoreRepository.repo().find({})
 
  stores = stores.filter(_store => {
    const cnpj = String(_store.settings['config_cnpj']).replace(/\D/g, '')
    const index = data.findIndex(_cnpj => _cnpj.includes(cnpj))
 
    if (index !== -1) {
 
      return true
    }
 
    return false
  })
 
  const today = moment().endOf('month')
  const from = moment(today).subtract(1, 'year').startOf('month')
 
  for await (const store of stores) {
    await ORM.setup(null, store.tenant)
    quantity_offers += await ProductRepository.repo(store.tenant).count({ status: true })
 
    const orders = await OrderRepository.repo(store.tenant).find({
      where: {
        createdAt: {
          $gte: from.toDate(),
          $lte: today.toDate()
        }
      }
    })
 
    if (orders.length > 0) {
      allOrders.push(...orders)
    }
  }
 
  while (initalMounth <= 13) {
    const pastYear = moment(from).add(initalMounth, 'month')
    const initialDate = moment(pastYear).subtract(1, 'month')
    const lastDate = moment(initialDate).endOf('month')
 
    const currentOrders = allOrders.filter(order => moment(order.createdAt).isBetween(initialDate, lastDate))
    const rejected_orders = currentOrders.filter(_order => order_status_rejected.includes(_order.statusOrder.type)).length
    const accepted_orders = currentOrders.filter(_order => !order_status_rejected.includes(_order.statusOrder.type) && !order_status_pending.includes(_order.statusOrder.type)).length
 
    if (currentOrders.length > 0) {
 
      report.push({
        accepted_orders,
        rejected_orders,
        date: `${moment(initialDate).format('DD/MM/YYYY')} - ${moment(lastDate).format('DD/MM/YYYY')}`,
        quantity_offers: '',
        quantity_store: ''
      })
    }
 
    initalMounth = initalMounth + 1
  }
 
  report.push({
    accepted_orders: '',
    rejected_orders: '',
    date: '',
    quantity_offers: `${Math.ceil(quantity_offers / stores.length)}`,
    quantity_store: stores.length
  })
 */