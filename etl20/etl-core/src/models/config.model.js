const Sequelize = require('sequelize');

const Config = {
    key: {type: Sequelize.STRING(100), primaryKey: true},
    value: Sequelize.TEXT
}

module.exports = Config;
