const Sequelize = require('sequelize');

const Product = {
    ean: {type: Sequelize.STRING(200), primaryKey: true},
    product_id: Sequelize.INTEGER(11),
    name: Sequelize.STRING(255),
    presentation: Sequelize.STRING(255),
    price: Sequelize.DOUBLE(11, 2),
    quantity: Sequelize.INTEGER(5),
    laboratory: Sequelize.STRING(255)
}

module.exports = Product;