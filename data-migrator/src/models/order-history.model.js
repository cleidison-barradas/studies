const Sequelize = require('sequelize');

const OrderHistory = {
    order_history_id: {type: Sequelize.INTEGER(11), autoIncrement: true, primaryKey: true},
    order_id: Sequelize.INTEGER(11),
    order_status_id: Sequelize.INTEGER(11),
    notify: {type: Sequelize.TINYINT(1), defaultValue: 0},
    comment: Sequelize.TEXT,
    date_added: Sequelize.DATE
}

module.exports = OrderHistory;
