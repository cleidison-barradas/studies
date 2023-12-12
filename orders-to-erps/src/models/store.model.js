const Sequelize = require('sequelize');

const Store = {
    store_id: {type: Sequelize.INTEGER(11), primaryKey: true},
    name: Sequelize.STRING(64),
    url: Sequelize.STRING(255),
    ssl: Sequelize.STRING(255),
    pmc_region_id: Sequelize.INTEGER(11)
}

module.exports = Store;