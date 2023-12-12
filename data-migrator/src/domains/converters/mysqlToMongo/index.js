const rdSync = require('readline-sync')
const extract = require('tld-extract')
const mongo = require('../../../mongoDB')
const database = require('../../../database')
const { logger, colors } = require('@mypharma/api-core')
const { models, fieldsToPopulate } = require('../../../../config.json')
const parser = require('../../product/services/mysqlProductParser')

const key = () => {
  return {
    name: 'importar do mysql para o mongo',
    operation: 'mysql_to_mongo'
  }
}

async function processModels(tenant, storeId) {
  for (const model of models) {
    let data = await parser({ model, tenant, storeId })

    logger(`started processing ${data.length} ${model.schema}`, colors.FgBlue)
    const response = await persistData(tenant, model, data)
    logger(`added ${response} in ${model.schema} succesfuly`, colors.FgCyan)
  }
}

async function processFields(tenant, storeId) {
  for await (const field of fieldsToPopulate) {
    let data = await mongo.getDataSchema(tenant, field.targetSchema)

    logger(`Started processing ${data.length}`, colors.FgBlue)
    const response = await populateData(storeId, tenant, field, data)
    logger(`populated ${response} succesfuly`, colors.FgGreen)

    data = []
  }
}

const persistData = (tenant, model, data) => {
  return new Promise(async (resolve) => {
    await mongo.saveFields(tenant, model.schema, data, async (added) => {
      resolve(added)
    })
  })
}

const populateData = (storeId, tenant, schema, data) => {
  return new Promise(async (resolve) => {
    await mongo.populateFields(storeId, tenant, schema, data, async (added) => {
      resolve(added)
    })
  })
}

const handle = async () => {
  try {
    const storeId = rdSync.question('which store will be imported ? store_id = ')

    if (!storeId) {
      logger('store_id not informed!', colors.FgRed)
      return await handle()
    }
    const store = await database.getByCustomQuery(Number(storeId), 'oc_store')

    if (store.length <= 0) {
      logger('store_not_found!', colors.FgRed)
      return await handle()
    }

    const { domain, sub, tld } = extract(store[0].url)
    const tenant = sub.concat(domain.replace('.' + tld, ''))

    await processModels(tenant, storeId)
    await processFields(tenant, storeId)


  } catch (error) {
    console.log(error)
  }

}

module.exports = { key, handle }
