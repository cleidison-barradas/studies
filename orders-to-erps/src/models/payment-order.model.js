const Sequelize = require('sequelize');

const PaymentOrder = {
    option_id: {type: Sequelize.INTEGER(11), primaryKey: true},
    order_id: {type: Sequelize.INTEGER(11), primaryKey: true},
    money_change: {type: Sequelize.DECIMAL(15, 4), defaultValue: 0.0000},
    conven_id: {type: Sequelize.STRING(100), allowNull: true},
    conven_password: {type: Sequelize.STRING(100), allowNull: true},
    date_added: Sequelize.DATE
}

module.exports = PaymentOrder;
