const mongoToMysql = require('./mongoToMysql')
const mysqlToMongo = require('./mysqlToMongo')
const syncProduct = require('./syncProduct')
const updateMainProducts = require('./updateMainProducts')

const allConverters = [mongoToMysql, mysqlToMongo, syncProduct, updateMainProducts]

allConverters.map(converter => {
  const { key, handle } = converter

  return {
    key,
    handle
  }
})

module.exports = allConverters
