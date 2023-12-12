const database = require("../database")
const { Color } = require("../utils/constants")
const logger = require("../utils/logger")
const fields = require('./model.fields')

/**
 * Parse Mongo to Mysql
 *
 * @param {String} table
 * @param {Array} data
 *
 * @returns {Array} fiedls parsed
 */
 const converter = ({ storeId, model, tenant }) => {
  logger(`Converting data to mysql...`, Color.FgYellow)

  return []
}

module.exports = { converter }
