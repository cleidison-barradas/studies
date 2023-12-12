const fs = require('fs');
require('dotenv').config()
const Config = require('../config')
const { ORM, OrderRepository, StoreRepository } = require('@mypharma/api-core')

var stream = fs.createWriteStream('totalOrders.txt', {
  flags: 'a'
})

exports.default = (async () => {
  ORM.config = Config.databases.mongoConfig
  await ORM.setup()
  
  const stores = await StoreRepository.repo().find()

  const actual_month = new Date().getMonth()
  const two_months_ago = new Date()

  two_months_ago.setMonth(actual_month - 2)

  const tenants = stores.map(store => store.tenant)
  console.log(two_months_ago)
      
      if (tenants.length > 0) {
        for await (const tenant of tenants) {
          await ORM.setup(null, tenant)

         const orders =  await OrderRepository.repo(tenant).find({
          select: ['createdAt']
        })
        let totalOrderCount = 0
        orders.map(order=>{ 
          if (order.createdAt >= two_months_ago)
            totalOrderCount++
         })
          stream.write(tenant + ";" + totalOrderCount + "\n");
          delete totalOrderCount;
        }
      }
      console.log("Finalizou!");
      stream.end();

})()
