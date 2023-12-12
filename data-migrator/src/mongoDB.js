const mongoose = require("mongoose")
const Models = require('./models/mongo')
const logger = require('./utils/logger')
const { Color } = require('./utils/constants')
const database = require('./database')
const { MONGO_NAME } = process.env

const SaveInAdmin = [
  "UserSchema",
  "CitySchema",
  "StateSchema",
  "CountrySchema",
  "PMCRegionSchema",
  "StatusOrderSchema",
  "NeighborhoodSchema",
  "ProductControlSchema",
  "ProductClassificationSchema",
]

const MAX_RECONNECT_ATTEMPTS = 10
let CURRENT_RECONNECT_ATTEMPTS = 0
let DATABASE = mongoose.connection
mongoose.Promise = global.Promise

class Mongo {

  init = async () => {
    const {
      MONGO_HOST,
      MONGO_PORT,
      MONGO_NAME,
      MONGO_USER,
      DATABASE_ENV,
      MONGO_PASSWORD,
    } = process.env

    try {
      await mongoose.connect(
        DATABASE_ENV ? `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_NAME}?retryWrites=true&w=majority` :
          `mongodb://${MONGO_HOST || 'localhost'}:${MONGO_PORT || 27017}/${MONGO_NAME || 'db'}?authSource=admin`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        user: MONGO_USER,
        pass: MONGO_PASSWORD
      })

      DATABASE = mongoose.connection;

      DATABASE.on('error', error => {
        if (error.name && error.name === 'MongoNetworkError') {
          this.reconnect()
        } else {
          throw error;
        }
      })

      this.loadModels();
      logger('MongoDB connected!', Color.FgGreen)

      return DATABASE

    } catch (error) {
      if (error.name && error.name === 'MongoNetworkError') {
        this.reconnect()
      } else {
        throw error
      }
    }
  }

  reconnect = () => {
    if (CURRENT_RECONNECT_ATTEMPTS < MAX_RECONNECT_ATTEMPTS) {
      CURRENT_RECONNECT_ATTEMPTS++;

      logger('Could not reach MongoDB! Retrying in 5 secs...', Color.FgRed)
      setTimeout(() => {
        init();
      }, 5000);
    } else {
      logger('Could not connect to MongoDB. Please check if all services is working and restart the Service.', Color.FgRed)
    }
  }

  loadModels = () => {
    Object.keys(Models).forEach(async key => {
      try {
        const schema = Models[key]

        const model = DATABASE.model(
          key,
          schema.schemaDefinition,
          schema.schemaName.toLowerCase()
        );
        // Save model instance
        schema._setModel(model)

        // Sync model
        await model.syncIndexes()

      } catch (error) {
        console.log(error)
      }
    })
  }

  getTenantDB = (tenant) => {
    if (mongoose.connection) {

      try {

        const db = mongoose.connection.useDb(tenant, { useCache: true })

        return db;

      } catch (error) {
        throw new Error(error.message)
      }
    }
  }

  /**
   * Return Model as per tenant
   */
  getModelByTenant = (tenant, modelName) => {
    const tenantDb = this.getTenantDB(!SaveInAdmin.includes(modelName) ? tenant : MONGO_NAME)
    const schema = Models[modelName]

    if (!schema) {
      throw new Error('Schema not found')
    }

    return tenantDb.model(modelName, schema.schemaDefinition, schema.schemaName);
  }

  /**
   * Returns Model as per Schema name
   *
   * @param {String} modelName
   */
  getModelBySchema = (modelName) => {
    const DB = this.getTenantDB(MONGO_NAME)
    const schema = Models[modelName]

    if (!schema) {
      throw new Error('Schema not found')
    }
    return DB.model(modelName, schema.schemaDefinition, schema.schemaName);
  }

  getSchemaByOriginalId = (tenant, schema, originalId) => {
    const Schema = this.getModelByTenant(tenant, schema)

    return Schema.findOne({ originalId }).then(response => {
      if (response) {

        return response
      }

      return null
    })
  }

  /**
   * get relation schema
   *
   * @param {String} tenant
   * @param {String} modelName
   * @param {String} filter
   */
  getDataSchema = (tenant, modelName, where = {}) => {
    const schema = this.getModelByTenant(tenant, modelName)

    return schema.find(where).then(response => {

      return response
    })
  }

  /**
   * Save new entity
   *
   * @param {Array} fieldData
   * @param {String} tenant
   * @param {String} modelName
   */
  saveFields = async (tenant, modelName, fieldData, callback, updateCache = undefined, cache = []) => {
    if (fieldData.length > 0) {
      const schema = this.getModelByTenant(tenant, modelName)
      const data = fieldData[0]
      const { originalId } = data

      const existData = await schema.exists({ originalId })

      if (!existData) {

        if (modelName === 'StoreSchema') {
          const { StoreSchema } = Models
          const Store = StoreSchema.Model()

          const storeExist = await Store.exists({ originalId })

          if (!storeExist) await Store.create(data)
        }

        const newfield = await schema.create(data)
        cache.push(newfield)

        if (updateCache !== undefined) {
          updateCache(cache.length)
        }

        fieldData.splice(0, 1)
        this.saveFields(tenant, modelName, fieldData, callback, updateCache, cache)

      } else {
        fieldData.splice(0, 1)
        this.saveFields(tenant, modelName, fieldData, callback, updateCache, cache)
      }

    } else {
      callback(cache.length)
    }
  }

  /**
   *
   * @param {String} storeId
   * @param {String} tenant
   * @param {Object} fields
   * @param {Array} fieldsData
   * @param {Function} callback
   */
  populateFields = async (storeId, tenant, fields, fieldsData, callback, updateCache = undefined, cache = []) => {
    if (fieldsData.length > 0) {
      const Schema = this.getModelByTenant(tenant, fields.targetSchema)
      const data = fieldsData[0]
      const { _id: id, originalId } = data
      const updateObj = {}

      if (fields.childs) {

        for await (const child of fields.childs) {
          if (data[child.key] !== null && data[child.key] !== 0 && child.defaultSave && data[child.key]) {
            const id = await this.getSchemaByOriginalId(tenant, child.target, data[child.key])

            if (id) {
              updateObj[child.field] = id
            }
          }

          if (fields.targetSchema === 'CategorySchema' && data[child.key] === "0" && !child.defaultSave && data['originalId']) {
            let subCategories = await this.getDataSchema(tenant, child.target, { parentId: data['originalId'] })
            updateObj[child.field] = subCategories
          }

          if (fields.targetSchema === 'StoreSchema' && !child.defaultSave) {
            if (child.key === 'setting') {
              const configs = await this.getDataSchema(tenant, child.target)

              if (configs.length > 0) {
                var obj = {}

                Object.keys(configs).forEach(k => {
                  const { key, value } = configs[k]
                  obj[key] = value

                  if (value === "1") obj[key] = true
                  else if (value === "2") obj[key] = true
                  else if (value === "0") obj[key] = false
                  else if (value === "true") obj[key] = true
                  else if (value === "false") obj[key] = false
                  else obj[key] = value
                })

                const { StoreSchema } = Models
                const Store = StoreSchema.Model()

                let store = await Store.findOne({ originalId })

                if (store && Object.keys(store.settings).length <= 0) {
                  await Store.updateOne(
                    { originalId },
                    { $set: { settings: obj } }
                  )
                }
              }
              updateObj[child.field] = obj
            }

            if (child.field === 'pmc' && data[child.key]) {
              const { StoreSchema } = Models
              const Store = StoreSchema.Model()

              const pmc = await this.getSchemaByOriginalId(tenant, child.target, data[child.key])

              await Store.updateOne(
                { originalId },
                { $set: { pmc } }
              )

              updateObj[child.field] = pmc
            }
          }

          if (fields.targetSchema === 'UserSchema' && !child.defaultSave && data[child.key]) {
            const { StoreSchema } = Models
            const Store = StoreSchema.Model()
            const store = await Store.findOne({ originalId: data[child.key] })

            if (store) updateObj[child.field] = store._id
          }

          if (fields.targetSchema === 'ProductSchema' && !child.defaultSave) {

            if (child.key === 'imageUrl' && data[child.key] && data[child.field] === null) {
              const File = this.getModelByTenant(tenant, child.target)

              let file = await File.create({
                name: data[child.key],
                key: data[child.key],
                url: data[child.key],
                folder: 'products'
              })

              updateObj[child.field] = file

            }

            if (child.key !== 'imageUrl' && data[child.key]) {

              const categories = await database.getProductCategories(data[child.key])
              let category = []

              if (categories.length > 0) {
                for await (const categoryField of categories) {
                  const id = await this.getSchemaByOriginalId(tenant, child.target, categoryField.category_id)

                  if (id) {
                    category.push(id)
                  }
                }
                updateObj[child.field] = category
              }
            }
          }
          if (fields.targetSchema === 'ShowCaseSchema' && !child.defaultSave && data[child.key]) {
            const setting = data[child.key]
            const parsedSetting = JSON.parse(setting)
            const { product: featuredProducts } = parsedSetting
            let showCaseProducts = []

            if (featuredProducts && featuredProducts.length > 0) {
              for await (let product of featuredProducts) {
                const value = await this.getSchemaByOriginalId(tenant, child.target, product)
                if (value) showCaseProducts.push(value)
              }

              if (showCaseProducts.length > 0) {
                updateObj[child.field] = showCaseProducts.map(item => {
                  return {
                    product: item,
                    position: null
                  }
                })
              }
            }
          }

          if (fields.targetSchema === 'CustomerSchema' && !child.defaultSave && data[child.key]) {
            const addresses = await this.getDataSchema(tenant, child.target, { originalCustomerId: data[child.key] })
            if (addresses.length > 0) {
              updateObj[child.field] = addresses
            }
          }

          if (fields.targetSchema === 'OrderSchema' && !child.defaultSave && data[child.key]) {
            let products = await database.getOrderProducts(data[child.key])

            if (products.length > 0) {

              for await (const product of products) {
                const id = await this.getSchemaByOriginalId(tenant, child.target, product.product)
                if (id) product['product'] = id
                else products = products.splice(0, product)
              }

              updateObj[child.field] = products
            }
          }
        }
      }

      if (Object.keys(updateObj).length > 0) {
        const schema = await Schema.updateOne(
          { _id: id },
          { $set: { ...updateObj } }
        )

        cache.push(schema)
        fieldsData.splice(0, 1)

        if (updateCache !== undefined) {
          updateCache(cache.length)
        }

        this.populateFields(storeId, tenant, fields, fieldsData, callback, updateCache, cache)

      } else {
        fieldsData.splice(0, 1)
        this.populateFields(storeId, tenant, fields, fieldsData, callback, updateCache, cache)
      }

    } else {
      callback(cache.length)
    }
  }
}

module.exports = new Mongo()

