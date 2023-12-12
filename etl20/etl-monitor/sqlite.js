// SequelizeJS
const { Sequelize } = require('sequelize');

// MomentJS
const moment = require('moment');

// Models
const Account = require('./models/account.model');
const History = require('./models/history.model');
const Config = require('./models/config.model');

class SQLite {
  /**
   * Initialize database manager
   * 
   * @param {String} storage 
   * @return {Promise}
   */
  init(storage) {
    this.database = new Sequelize({
      storage: storage,
      dialect: 'sqlite',
      dialectOptions: {
        mode: 2
      },
      password: 'MYP2018',
      logging: false
    });

    return this.database.authenticate().then(() => {
      this.account = this.database.define('account', Account, { tableName: "account", timestamps: false });
      this.history = this.database.define('history', History, { tableName: "history", timestamps: false });
      this.config = this.database.define('config', Config, {tableName: "config", timestamps: false});

      return this.database.sync();
    });
  }

  query(sql) {
    return this.database.query(sql)
  }

  /**
   * Get status history
   * 
   * @return {Array}
   */
  getHistory() {
    return this.history.findAll({
      order: [
        ['start_date', 'DESC']
      ]
    }).then(history => {
      return history.map(p => {
        const { status, extras, start_date, end_date } = p;
        let duration = null;
        let active = true;

        if (end_date !== null) {
          const start = moment(start_date);
          const end = moment(end_date);

          active = false;
          duration = end.diff(start);
        }

        return {
          status,
          extras,
          duration,
          active,
          start_date,
          end_date
        }
      });
    });
  }

  /**
   * Get current status
   * 
   * @return {Object}
   */
  getCurrentStatus() {
    return this.history.findOne({
      where: {
        end_date: null
      },
      order: [
        ['start_date', 'DESC']
      ]
    }).then(history => {
      if (history === null) return undefined;
      const { status, extras } = history;

      return {
        status,
        extras
      }
    })
  }

  /**
   * Get config
   * 
   * @param {String} key 
   * @return {Object}
   */
  getConfig(key) {
    return this.config.findOne({
        where: {
            key
        }
    })
}
}

module.exports = new SQLite();
