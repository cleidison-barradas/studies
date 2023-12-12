const Sequelize = require('sequelize');

const User = {
    integration_user_id: {type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true},
    username: {type: Sequelize.STRING(45)},
    email: {type: Sequelize.STRING(45)},
    password: {type: Sequelize.STRING(45)},
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE
}

module.exports = User;