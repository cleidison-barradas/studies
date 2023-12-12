const fs = require('fs');
const { Sequelize } = require('sequelize');
const { cargo } = require('async');
const logger = require('./utils/logger');
// Models
const Product = require('./models/product.model');
const Account = require('./models/account.model');
const Config = require('./models/config.model');
const History = require('./models/history.model');

// Required configurations fields
const REQUIRED_CONFIG = [
    'database_dialect',
    'database_host',
    'database_port',
    'database_name',
    'database_username',
    'database_password',
    'database_convenio'
];

class SQLite {
    constructor() {
        this.remoteBulkQueue = cargo((tasks, callback) => {
            if (tasks.length > 0) {
                this.product.bulkCreate(tasks).then(() => {
                    callback();
                }, err => {
                    console.log(err)
                    callback(err);
                });
            } else {
                callback();
            }
        }, 3000);
    }

    async init(storage) {
        // Check if database exists, if not, create
        if (!fs.existsSync(storage)) {
            fs.openSync(storage, 'wx');
            fs.closeSync(storage);
        }

        this.database = new Sequelize({
            storage: storage,
            password: 'MYP2018',
            dialect: 'sqlite',
            dialectOptions: {
                mode: 2
            },
            //operatorsAliases: false,
            logging: false
        });

        try {
            await this.database.authenticate();

            // Define models
            this.originalProduct = this.database.define('products0', Product, { tableName: "products0", timestamps: false, indexes: [{ unique: true, fields: ['ean'] }] });
            this.product = this.database.define('products', Product, { tableName: "products", timestamps: false, indexes: [{ unique: true, fields: ['ean'] }] });
            this.account = this.database.define('account', Account, { tableName: "account", timestamps: false });
            this.config = this.database.define('config', Config, { tableName: "config", timestamps: false });
            this.history = this.database.define('history', History, { tableName: "history", timestamps: false });

            // Sync models
            await this.database.sync();

            return true;
        } catch (error) {
            console.log(error)

            throw error;
        }
    }

    close() {
        return this.database.close();
    }

    saveAccount(user_id, erp_name, token, publicKey) {
        return this.account.findOne({
            where: {
                user_id
            }
        }).then(account => {
            if (account) {
                return account.update({ user_id, erp_name, token, publicKey });
            } else {
                return this.account.create({ user_id, erp_name, token, publicKey });
            }
        })
    }

    saveKey(user_id, publicKey) {
        return this.account.findOne({
            where: {
                user_id
            }
        }).then(account => {
            if (account) {
                return account.update({ publicKey });
            } else return null
        })
    }

    saveAllRemoteProducts(products) {
        return new Promise(async (resolve) => {
            products.forEach(product => this.remoteBulkQueue.push(product))

            this.remoteBulkQueue.drain(() => {
                resolve();
            });
        });
    }

    saveProduct(product) {
        return this.product.findOne({
            where: {
                product_id: product.product_id
            }
        }).then(storedProduct => {
            if (storedProduct) {
                return storedProduct.update(product);
            } else {
                return this.product.create(product);
            }
        })
    }

    saveOriginalProduct(product) {
        return this.originalProduct.findOne({
            where: {
                ean: product.ean
            }
        }).then(storedProduct => {
            if (storedProduct) {
                if (Number(storedProduct.price).toFixed(8) !== Number(product.price).toFixed(8) || Number(storedProduct.quantity) !== Number(product.quantity)) {
                    return storedProduct.update(product).then(() => {
                        return {
                            ...product,
                            status: 'updated'
                        };
                    });
                } else {
                    return { status: 'up_to_date' };
                }
            } else {
                return this.originalProduct.create(product).then(() => {
                    return {
                        ...product,
                        status: 'created'
                    };
                });
            }
        })
    }

    productDiff(product, schema) {
        return this.product.findOne({
            where: {
                ean: product.ean
            }
        }).then(remoteProduct => {
            if (remoteProduct === null) return true;

            const schemaFields = Object.keys(schema)
            for (const field of schemaFields) {
                if (!!schema[field].delta) {
                    const valueA = typeof product[field] === 'string' ? product[field].trim() : product[field]
                    const valueB = typeof remoteProduct[field] === 'string' ? remoteProduct[field].trim() : remoteProduct[field]

                    if (valueA !== valueB) {
                        return true
                    }
                }
            }

            return false

            // if (Number(remoteProduct.price).toFixed(8) !== Number(product.price).toFixed(8) || Number(remoteProduct.quantity) !== Number(product.quantity)) {
            //     return true;
            // } else {
            //     return false;
            // }
        })
    }

    resetRemoteProducts() {
        return this.product.sync().then(() => {
            return this.database.query(`DELETE FROM products`);
        });
    }

    resetCachedProducts() {
        return this.product.sync().then(() => {
            return this.database.query(`DELETE FROM products0`);
        });
    }

    validateConfig() {
        return this.config.findAll({
            where: {
                key: {
                    [Sequelize.Op.or]: [
                        {
                            [Sequelize.Op.like]: 'database_%'
                        },
                        {
                            [Sequelize.Op.like]: 'sync_%'
                        }
                    ]
                }
            }
        }).then(config => {
            if (config.length >= 2) return true;

            return false;
        })
    }

    createOrUpdateConfig(key, value) {
        return this.config.findOne({
            where: {
                key
            }
        }).then(config => {
            if (config === null) {
                return this.config.create({
                    key,
                    value
                });
            } else {
                return config.update({ value });
            }
        });
    }

    getConfig(keyPrefix) {
        return this.config.findAll({
            where: {
                key: {
                    [Sequelize.Op.like]: keyPrefix + '_%'
                }
            }
        }).then(config => {
            return config;
        })
    }

    saveNewStatus(status) {
        return this.history.update({
            end_date: new Date()
        }, {
            where: {
                start_date: {
                    [Sequelize.Op.not]: null
                },
                end_date: {
                    [Sequelize.Op.eq]: null
                }
            }
        }).then(() => {
            return this.history.create({
                status: status,
                start_date: new Date()
            });
        });
    }
}

module.exports = new SQLite();