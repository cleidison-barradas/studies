const Sequelize = require('sequelize')

const Store = {
  store_id: {type: Sequelize.INTEGER(11), primaryKey: true},
  name: Sequelize.TEXT,
  url: Sequelize.TEXT,
  ssl: Sequelize.TEXT,
  pmc_region_id: Sequelize.INTEGER
}

module.exports = Store
