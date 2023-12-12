const Sequelize = require('sequelize');

const OrderProduct = {
    order_product_id: {type: Sequelize.INTEGER(11), autoIncrement: true, primaryKey: true},
    order_id: Sequelize.INTEGER(11),
    product_id: Sequelize.INTEGER(11),
    name: {type: Sequelize.STRING(255), defaultValue: ''},
    model: Sequelize.STRING(64),
    quantity: Sequelize.INTEGER(4),
    price: {type: Sequelize.DECIMAL(15, 4), defaultValue: 0.0000},
    total: {type: Sequelize.DECIMAL(15, 4), defaultValue: 0.0000},
    tax: {type: Sequelize.DECIMAL(15, 4), defaultValue: 0.0000},
    reward: Sequelize.INTEGER(8)
}

module.exports = OrderProduct;
