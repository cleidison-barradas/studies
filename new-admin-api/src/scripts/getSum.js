require('dotenv').config()
const rd = require('readline')
const moment = require('moment')
const Config = require('../config')
const { ORM, OrderRepository, StoreRepository } = require('@mypharma/api-core')

const task = rd.createInterface({
  input: process.stdin,
  output: process.stdout
})

exports.default = (async () => {
  ORM.config = Config.databases.mongoConfig
  await ORM.setup()
  let total = 0

  const stores = await StoreRepository.repo().find()
  const tenants = stores.map(store => store.tenant)

  task.question('Enter with date start ', async (date_start = new Date()) => {

    task.question('Enter with date end ', async (date_end = new Date()) => {

      if (tenants.length > 0) {
        for await (const tenant of tenants) {
          await ORM.setup(null, tenant)

          const orders = await OrderRepository.repo(tenant).find({
            where: {
              createdAt: { $gte: moment(date_start).startOf('day').toDate(), $lt: moment(date_end).endOf('day').toDate() },
              $or: [
                { 'paymentMethod.paymentOption.name': 'Pagseguro' },
                { 'paymentMethod.paymentOption.name': 'Pix' }
              ]
            }
          })

          orders.forEach(order => {
            total += order.totalOrder
          })
        }
        console.log(total)
      }
    })
  })

})()
