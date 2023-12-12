const Sequelize = require('sequelize');

const IntegrationOrder = {
    integration_order_id: {type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true},
    store_id: {type: Sequelize.INTEGER(11)},
    integration_user_id: {type: Sequelize.INTEGER(11)},
    token: {type: Sequelize.STRING(45)},
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE
}

module.exports = IntegrationOrder;