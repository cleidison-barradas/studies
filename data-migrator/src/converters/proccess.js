const Mongo = require('../mongoDB')
const database = require('../database')
const logger = require('../utils/logger')
const Schemas = require('./model.fields')
const { Color } = require('../utils/constants')

let data = []
const schemaToUpdate = [
  "CategorySchema",
  "ProductSchema"
]

/**
 * Parse Entities
 * @param {String} query
 * @param {String} table
 */
const parseEntities = async ({ query, table }) => {
  try {
    data = await database.getByCustomQuery(0, '', '', query)

    if (data.length <= 0) return []

    const fieldSchemaKeys = Object.keys(Schemas[table])
    const fieldSchemaValues = Object.values(Schemas[table])

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
        }
      })
      return obj
    })

    const entities = Object.assign([], data)
    data = []
    logger(`Loading ${entities.length} ${table}`, Color.FgBlue)

    logger(`Process ${entities.length} to save`, Color.FgYellow)

    await saveEntities({ entities, schema: table })

    await updateEntities({ table })

  } catch (error) {
    console.log(error)
    throw new Error('Error on converting entities')
  }
}

/**
 *
 * @param {String} entities
 * @param {String} schema
 *
 */
const saveEntities = async ({ entities, schema }) => {
  try {
    const Schema = Mongo.getModelBySchema(schema)

    for await (const entity of entities) {
      const existEntity = await Schema.exists({ originalId: entity['originalId'] })

      if (!existEntity) {
        await Schema.create(entity)
      }
    }

  } catch (error) {
    console.log(error)
    throw new Error('Error on saving entities')
  }
}

/**
 *
 * @param {String} schema name of mongo schema
 * @param {Object} where filter
 */
const getDataPaginated = ({ schema, where = {}, limit = 0, skip = 0 }) => {
  const Model = Mongo.getModelBySchema(schema)

  return Model.find(where).limit(limit).skip(skip)
}
const getByOriginalId = ({ schema, originalId }) => {
  const Model = Mongo.getModelBySchema(schema)

  return Model.findOne({ originalId })
}

const updateEntities = async ({ table }) => {
  let updateObj = {}
  const childsToUpdate = [
    {
      schema: 'ManufacturerSchema',
      key: 'originalManufacturerId',
      path: 'manufacturer'
    },
    {
      schema: 'ProductControlSchema',
      key: 'originalControlId',
      path: 'control'
    },
    {
      schema: 'ProductClassificationSchema',
      key: 'originalClassificationId',
      path: 'classification'
    },
    {
      schema: 'FileSchema',
      key: 'imageUrl',
      path: 'image'
    },
    {
      schema: 'CategorySchema',
      key: 'originalId',
      path: 'category'
    },
  ]

  if (schemaToUpdate.includes(table)) {
    const Model = Mongo.getModelBySchema(table)

    if (table === 'CategorySchema') {
      const categories = await getDataPaginated({ schema: table })

      for await (const category of categories) {

        if (category.parentId === "0") {
          const where = { parentId: category.originalId }

          const subCategories = await getDataPaginated({ schema: table, where })
          if (subCategories.length > 0) updateObj['subCategories'] = subCategories

          if (Object.keys(updateObj).length > 0) {
            await Model.updateOne(
              { _id: category._id },
              { $set: { ...updateObj, updatedAt: new Date() } }
            )
            updateObj = {}
          }
        }
      }
    }

    if (table === 'ProductSchema') {
      await updateProducts(childsToUpdate, table)
    }
  }
}

const updateProducts = async (childsToUpdate = [], table, limit = 1000, skip = 0) => {
  const Model = Mongo.getModelBySchema(table)
  let products = await getDataPaginated({ schema: table, limit, skip })
  let updateObj = {}

  if (products.length > 0) {
    for await (const product of products) {

      for await (const child of childsToUpdate) {
        if (child.schema === 'FileSchema') {
          const Model = Mongo.getModelBySchema(child.schema)
          if (product[child.key] !== null) {

            const image = await Model.create({
              name: product[child.key],
              url: product[child.key],
              key: product[child.key],
              folder: 'products',
            })

            updateObj[child.path] = image
          }
        }
        if (child.schema === 'CategorySchema') {
          const categories = await database.getProductCategories(product[child.key])
          const categoryData = []

          if (categories.length > 0) {
            for await (const field of categories) {
              const category = await getByOriginalId({ schema: child.schema, originalId: field.category_id })
              if (category) categoryData.push(category)
            }
          }
          updateObj[child.path] = categoryData
        }

        if (product[child.key] !== null) {
          const value = await getByOriginalId({ schema: child.schema, originalId: product[child.key] })

          if (value) updateObj[child.path] = value
        }
      }

      if (Object.keys(updateObj).length > 0) {

        await Model.updateOne(
          { _id: product._id },
          { $set: { ...updateObj, updatedAt: new Date() } }
        )
        updateObj = {}
      }
    }
    logger(`loaded ${products.length} products`, Color.FgCyan)
    products = []
    return await updateProducts(childsToUpdate, table, limit, skip = (limit + skip))
  } else {
    products = []
    logger(`updated products`, Color.FgCyan)
  }
  return products
}

module.exports = { parseEntities, updateEntities }
