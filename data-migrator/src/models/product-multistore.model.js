const Sequelize = require('sequelize');

const ProductMultiStore = {
    product_id: {type: Sequelize.INTEGER(11), primaryKey: true},
    store_id: {type: Sequelize.INTEGER(11), primaryKey: true},
    price: {type: Sequelize.DECIMAL(15, 4), defaultValue: 0.0000},
    quantity: Sequelize.INTEGER(11),
    update_origin: Sequelize.ENUM('store', 'xls', 'etl'),
    date_added: Sequelize.DATE,
    date_modified: Sequelize.DATE,
    last_stock: {type: Sequelize.DATE, defaultValue: null}
}

module.exports = ProductMultiStore;