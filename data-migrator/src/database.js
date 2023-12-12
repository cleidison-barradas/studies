const Sequelize = require("sequelize")

class Database {
  constructor() {
    this.databaseHost = undefined
    this.databasePort = 3306
    this.databaseName = undefined
    this.databaseUser = undefined
    this.databasePassword = undefined
    this.db = undefined
  }
  configure(opts) {
    const { host, database, username, password, port } = opts

    this.databaseHost = host
    this.databasePort = port
    this.databaseName = database
    this.databaseUser = username
    this.databasePassword = password

    return this
  }
  async init() {
    this.db = new Sequelize(
      this.databaseName,
      this.databaseUser,
      this.databasePassword,
      {
        host: this.databaseHost,
        port: this.databasePort,
        dialect: "mysql",
        dialectOptions: {
          multipleStatements: true,
        },
        pool: {
          max: 100,
          min: 0,
          acquire: 60000,
        },
        retry: {
          match: [
            /SequelizeConnectionError/,
            /SequelizeConnectionRefusedError/,
            /SequelizeHostNotFoundError/,
            /SequelizeHostNotReachableError/,
            /SequelizeInvalidConnectionError/,
            /SequelizeConnectionTimedOutError/,
          ],
          name: "query",
          backoffBase: 100,
          backoffExponent: 1.1,
          timeout: 60000,
          max: Infinity,
        },
        logging: false,
      }
    )
  }

  query(sql) {
    return this.db.query(sql)
  }

  async getAllStores() {
    return await this.store.findAll({
      raw: true,
    })
  }

  getByCustomQuery(storeId = 0, table, field = "store_id", query = null) {
    const defaultQueryById = "SELECT * FROM " + table + " WHERE " + field + " = " + storeId + ""
    const defaultQuery = "SELECT * FROM " + table + ""

    if (storeId !== 0) {
      return this.db.query(query ? query + " WHERE " + field + " = " + storeId + "" : defaultQueryById).then(response => {
        const [results, _] = response

        return results
      })
    }

    return this.db.query(query ? query : defaultQuery).then(response => {
      const [results, _] = response

      return results
    })
  }

  getOrderProducts(order_id) {
    return this.db.query("SELECT * FROM oc_order_product WHERE order_id = " + order_id + "").then(response => {
      if (response.length > 0) {
        let [products, _] = response

        products = products.map(product => {
          const { product_id, price, model, name, quantity } = product

          return {
            product: product_id,
            name: `${model} ${name}`,
            unitaryValue: price,
            amount: quantity,
          }
        })

        return products
      }

      return []
    })

  }

  getProductCategories(product_id) {
    return this.db.query("SELECT * FROM oc_product_to_category WHERE product_id = " + product_id + "").then(response => {
      if (response) {
        const [results, _] = response

        return results

      }
      return []
    })
  }

  getPmcValueInRegions(region_id) {
    return this.db.query("SELECT * FROM oc_pmcs_values_in_regions WHERE region_id = " + region_id + "").then(response => {
      if (response) {
        const [results, _] = response

        return results
      }
      return []
    })
  }
}

module.exports = new Database()
