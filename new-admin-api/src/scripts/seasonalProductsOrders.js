require('dotenv').config()
const rd = require('readline');
const moment = require('moment');
const Config = require('../config');
const { ORM, OrderRepository, StoreRepository } = require('@mypharma/api-core');
const { take, slice } = require('lodash');

const task = rd.createInterface({
  input: process.stdin,
  output: process.stdout
})

let topMedicines = new Map([]);
let topProducts = new Map([]);
let ordenedProducts = []
let ordenedMedicines = []

exports.default = (async () => {
  ORM.config = Config.databases.mongoConfig;
  await ORM.setup();

  task.question('Enter with date start (YYYY-MM-DD)', async (date_start = "2021-06-21") => {


    task.question('Enter with date end (YYYY-MM-DD)', async (date_end = "2021-06-25") => {

      const autumnStart = moment(date_start)

      const autumnEnd = moment(date_end)

      const stores = await StoreRepository.repo().find();
      const tenants = stores.map(store => store.tenant);

      if (tenants.length > 0) {
        for await (const tenant of tenants) {
          await ORM.setup(null, tenant)
          
          const orders = await OrderRepository.repo(tenant).find({
            select: ["products", "createdAt"],
            where: {
              createdAt: { $gte: autumnStart.clone().utc(true).startOf('day').toDate(), $lte: autumnEnd.clone().utc(true).endOf('day').toDate() }}
            
          })

          if (orders.length > 0) {
          orders.forEach(order => {

            order.products.forEach(_product => {
              
              if (_product && _product.product.classification && Object.keys(_product.product.classification).length > 0) {

                if ((_product.product.classification.name === 'ETICO') || (_product.product.classification.name === 'GENERICO') || (_product.product.classification.name === 'SIMILAR') || (_product.product.control)) {
                  
                  if(!topMedicines.has(_product.product.EAN)) {
                    topMedicines.set(_product.product.EAN, {
                     ean: _product.product.EAN,
                     quantity: _product.amount
                    })
                 } else {
                   let prod = topMedicines.get(_product.product.EAN)
                   prod.quantity += _product.amount
                   topMedicines.delete(_product.product.EAN)
                   topMedicines.set(_product.product.EAN, prod)
                 }
                }   
              } else {
              if(!topProducts.has(_product.product.EAN)) {
                 topProducts.set(_product.product.EAN, {
                  ean: _product.product.EAN,
                  quantity: _product.amount
                 })
              } else {
                let prod = topProducts.get(_product.product.EAN)
                prod.quantity += _product.amount
                topProducts.delete(_product.product.EAN)
                topProducts.set(_product.product.EAN, prod)
              }
              }
            })}
          ) 
          }
      }}

      
      topProducts.forEach(product => {
        ordenedProducts.push(product)
      })
      ordenedProducts = ordenedProducts.sort((a, b) => {
        return b.quantity - a.quantity
      })

      topMedicines.forEach(product => {
        ordenedMedicines.push(product)
      })
      ordenedMedicines = ordenedMedicines.sort((a, b) => {
        return b.quantity - a.quantity
      })

      console.log("Medicamentos:")
      console.table(ordenedMedicines.slice(0,10))

      console.log("Produtos:")
      console.table(ordenedProducts.slice(0,30))

    })
  })

})()
