const Sequelize = require('sequelize');

const PaymentOption = {
    option_id: {type: Sequelize.INTEGER(11), primaryKey: true},
    name: Sequelize.STRING(100),
    type: Sequelize.ENUM('deibt', 'credit', 'money', 'covenant', 'gateway')
}

module.exports = PaymentOption;
