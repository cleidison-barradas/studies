const Sequelize = require('sequelize');

const ProductDescription = {
    product_id: {type: Sequelize.INTEGER(11), primaryKey: true},
    language_id: {type: Sequelize.INTEGER(11), primaryKey: true},
    name: Sequelize.STRING(255),
    description: Sequelize.TEXT,
    tag: Sequelize.TEXT,
    meta_title: Sequelize.STRING(255),
    meta_description: Sequelize.STRING(255),
    meta_keyword: Sequelize.STRING(255)
}

module.exports = ProductDescription;