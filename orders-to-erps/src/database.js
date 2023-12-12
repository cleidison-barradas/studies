const Sequelize = require('sequelize');

const User = require('./models/integration-user.model');
const OrderIntegration = require('./models/integration-order.model');
const Order = require('./models/order.model');
const OrderProduct = require('./models/order-product-model');
const OrderStatus = require('./models/order-status.model');
const Product = require('./models/product.model');    
const Store = require('./models/store.model');
const OrderTotal = require('./models/order-total.model');
const PaymentOrder = require('./models/payment-order.model');
const PaymentOption = require('./models/payment-option.model');

class Database {

    init() {
        const { MYSQL_HOST, MYSQL_PORT, MYSQL_NAME, MYSQL_USER, MYSQL_PASSWORD } = process.env;

        this.db = new Sequelize(MYSQL_NAME, MYSQL_USER, MYSQL_PASSWORD, {
            host: MYSQL_HOST,
            port: MYSQL_PORT,
            dialect: 'mysql',
            dialectOptions: {
                multipleStatements: true
            },
            pool: {
                max: 10,
                min: 0,
                acquire: 30000
            },
            retry: {
                match: [
                    /SequelizeConnectionError/,
                    /SequelizeConnectionRefusedError/,
                    /SequelizeHostNotFoundError/,
                    /SequelizeHostNotReachableError/,
                    /SequelizeInvalidConnectionError/,
                    /SequelizeConnectionTimedOutError/
                ],
                name: 'query',
                backoffBase: 100,
                backoffExponent: 1.1,
                timeout: 60000,
                max: Infinity
            },
            operatorsAliases: false,
            logging: false

        });

        return this.db.authenticate().then(() => {
            this.user = this.db.define('integration_user_erp', User, { tableName: "oc_integration_user_erp", timestamps: false });
            this.orderIntegration = this.db.define('integration_order_erp', OrderIntegration, { tableName: "oc_integration_order_erp", timestamps: false });
            this.order = this.db.define('order', Order, { tableName: "oc_order", timestamps: false });
            this.orderStatus = this.db.define('orderStatus', OrderStatus, { tableName: "oc_order_status", timestamps: false });
            this.orderProduct = this.db.define('orderProduct', OrderProduct, { tableName: "oc_order_product", timestamps: false });
            this.product = this.db.define('product', Product, { tableName: 'oc_product', timestamps: false });
            this.store = this.db.define('store', Store, { tableName: 'oc_store', timestamps: false });
            this.orderTotal = this.db.define('orderTotal', OrderTotal, { tableName: "oc_order_total", timestamps: false });
            this.paymentOrder = this.db.define('paymentOrder', PaymentOrder, { tableName: "oc_mypharma_payment_order", timestamps: false });
            this.paymentOption = this.db.define('paymentOption', PaymentOption, { tableName: "oc_mypharma_payment_option", timestamps: false });


            this.order.hasMany(this.orderProduct, { foreignKey: 'order_id' });
            this.orderProduct.belongsTo(this.order, { foreignKey: 'order_id' });

            // Relationship between Order and OrderStatus
            this.orderStatus.hasMany(this.order, { foreignKey: 'order_status_id' });
            this.order.belongsTo(this.orderStatus, { foreignKey: 'order_status_id' });

            // Relationship between Product and OrderProduct
            this.product.hasMany(this.orderProduct, { foreignKey: 'product_id' });
            this.orderProduct.belongsTo(this.product, { foreignKey: 'product_id' });

            this.user.hasMany(this.orderIntegration, { foreignKey: 'integration_user_id' });
            this.orderIntegration.belongsTo(this.user, { foreignKey: 'integration_user_id' });

            this.store.hasMany(this.orderIntegration, { foreignKey: 'store_id' });
            this.orderIntegration.belongsTo(this.store, { foreignKey: 'store_id' });

            this.order.hasMany(this.orderTotal, { foreignKey: 'order_id' });
            this.orderTotal.belongsTo(this.order, { foreignKey: 'order_id' });

            this.order.hasMany(this.paymentOrder, { foreignKey: 'order_id' });
            this.paymentOrder.belongsTo(this.order, { foreignKey: 'order_id' });

            this.paymentOrder.hasMany(this.paymentOption, { foreignKey: 'option_id' });
            this.paymentOption.belongsTo(this.paymentOrder, { foreignKey: 'option_id' });

            return true;
        })
    }

    query(sql) {
        return this.db.query(sql)
    }

}
module.exports  = new Database();
