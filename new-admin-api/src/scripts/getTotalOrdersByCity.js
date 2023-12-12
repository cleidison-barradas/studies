const fs = require('fs');
require('dotenv').config()
const Config = require('../config')
const { ORM, OrderRepository, StoreRepository } = require('@mypharma/api-core');
const { Console } = require('console');

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

  let total = new Map()


  const tenants = stores.map(store => store.tenant)

      
      if (tenants.length > 0) {
        for await (const tenant of tenants) {

          await ORM.setup(null, tenant)

          const orders = await OrderRepository.repo(tenant).aggregate([
            {
                '$match': {
                    "deliveryData.neighborhood.city.name": { $ne: null },
                }
            },
            {
        
              
            "$group": {"_id": "$deliveryData.neighborhood.city.name", "count": {"$sum": 1}}
          },
          {
              "$project": {
                  "cidade": "$_id",
                  "total": "$count"
              }
          }]).toArray()


        // console.log(orders[0])
        
         for (const actualOrder of orders){
           if (total[actualOrder['cidade']]) {
            total[actualOrder['cidade']]+=actualOrder['total']
           }
           else {
            console.log(actualOrder)
            total[actualOrder['cidade']] = actualOrder['total']
           }
        }
    }
        console.log(total)

        let objectCities = Object.keys(total).map((key) => {
            return { cidade: key, value: total[key] }
        })
      
        objectCities = objectCities.sort((a, b) => {
            return b.value - a.value
        })
      
        for (city of objectCities) {
            stream.write(city.cidade + ';' + city.value + '\n')
        }

        console.log(objectCities)
            

      console.log("Finalizou!");
      stream.end();
      }
})()
