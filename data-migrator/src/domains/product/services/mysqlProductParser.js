const database = require('../../../database')
const { QueuePlugin, logger, colors } = require('@mypharma/api-core')
const models = require('../../../converters/model.fields')

let data = []
let result = []
const statusType = {
  1: 'pending',
  3: 'accepted',
  7: 'rejected',
  17: 'default',
  19: 'default',
  18: 'reversed',
  20: 'default',
  21: 'default',
  22: 'payment_made',
}

/**
 *
 * @param {Object} options
 * @param {String} options.model
 * @param {String} options.tenant
 * @param {String} options.storeId
 *
 * @returns {Promise<Array>}
 */
const parser = async ({ model, tenant, storeId }) => {
  try {
    if (model.getByField) {
      const { getByField } = model
      let query = ""
      let field = null

      model.query ? query = model['query'] : ""
      getByField ? field = getByField : null

      data = await database.getByCustomQuery(storeId, model.table, field, query)

    } else {
      let query = ""

      model.query ? query = model['query'] : ""

      data = await database.getByCustomQuery(0, model.table, null, query !== "" ? query : null)
    }

    if (data.length > 0) {

      const fieldSchemaKeys = Object.keys(models[model.schema])
      const fieldSchemaValues = Object.values(models[model.schema])

      data = data.map(item => {
        let obj = {}
        Object.keys(item).forEach(key => {
          const index = fieldSchemaValues.indexOf(key)

          if (index !== -1) {
            const field = fieldSchemaKeys[index]

            obj = {
              ...obj,
              [field]: item[key]
            }

            if (model.schema === 'StoreSchema') {
              obj = {
                ...obj,
                ['tenant']: tenant
              }
            }

            if (model.schema === 'StatusOrderSchema') {
              obj = {
                ...obj,
                ['type']: statusType[item['order_status_id']]
              }
            }
          }

        })

        if (model.schema === 'ProductSchema') {
          result.push({
            ean: item['ean'],
            tenant
          })
        }

        return obj
      })
      const loadData = Object.assign([], data)
      data = []
      if (result.length > 0) {
        logger(`Invalidating ${result.length} products!`, colors.FgYellow)
        await QueuePlugin.publish('mongo-invalidate-product', result)
        result = []
      }

      return loadData
    }

    return []

  } catch (error) {
    console.log(error)
    return []
  }
}

module.exports = parser
