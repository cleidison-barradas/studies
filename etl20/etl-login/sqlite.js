const Sequelize = require('sequelize');

// Models
const Account = require('./models/account.model');

class SQLite {
    init(storage) {
        this.database = new Sequelize({
            storage: storage,
            dialect: 'sqlite',
            operatorsAliases: false,
            logging: false
        });

        return this.database.authenticate().then(() => {
            this.account = this.database.define('account', Account, {tableName: "account", timestamps: false});

            return this.account.sync();
        });
    }

    saveAccount(user_id, erp_name, token, publicKey) {
        return this.account.findOne({
            where: {
                user_id
            }
        }).then(account => {
            if (account) {
                return account.update({user_id, erp_name, token, publicKey});
            } else {
                return this.account.create({user_id, erp_name, token, publicKey});
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
                return account.update({publicKey});
            } else return null
        })
    }
}

module.exports = new SQLite();