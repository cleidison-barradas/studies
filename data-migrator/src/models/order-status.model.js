const Sequelize = require('sequelize');

const OrderStatus = {
    order_status_id: {type: Sequelize.INTEGER(11), primaryKey: true},
    language_id: Sequelize.INTEGER(11),
    name: Sequelize.STRING(32)
}

module.exports = OrderStatus;
