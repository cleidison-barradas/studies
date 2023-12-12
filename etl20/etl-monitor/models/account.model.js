const Sequelize = require('sequelize');

const Account = {
    user_id: {type: Sequelize.INTEGER(11), primaryKey: true},
    erp_name: Sequelize.STRING(160),
    token: Sequelize.TEXT,
    publicKey: Sequelize.TEXT
}

module.exports = Account;
