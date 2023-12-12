const Sequelize = require('sequelize');

const ProductStore = {
    product_id: {type: Sequelize.INTEGER(11), primaryKey: true},
    store_id: {type: Sequelize.INTEGER(11), primaryKey: true},
}

module.exports = ProductStore;