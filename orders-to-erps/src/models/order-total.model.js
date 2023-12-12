const Sequelize = require('sequelize');

const OrderTotal = {
    order_total_id: {type: Sequelize.INTEGER(10), autoIncrement: true, primaryKey: true},
    order_id: Sequelize.INTEGER(11),
    code: Sequelize.STRING(32),
    title: Sequelize.STRING(255),
    value: {type: Sequelize.DECIMAL(15, 4), defaultValue: 0.0000},
    sort_order: Sequelize.INTEGER(3)
}

module.exports = OrderTotal;
