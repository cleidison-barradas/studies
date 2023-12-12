const Sequelize = require('sequelize');

const History = {
    id: {type: Sequelize.INTEGER(10), primaryKey: true, autoIncrement: true},
    status: Sequelize.STRING(120),
    extras: Sequelize.STRING(200),
    start_date: Sequelize.DATE,
    end_date: Sequelize.DATE
}

module.exports = History;
