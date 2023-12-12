const { createPool, PoolOptions } = require('mysql2/promise')

class Transaction {

  pool = null
  constructor(pool) {
    this.pool = pool
  }

  /**
   *
   * @param {String} sql
   * @param {Array} values
   * @returns {Array<any>}
   */
  async query(sql, values) {
    return this.pool.execute(sql, values)
  }

  async commit() {
    await this.pool.execute('COMMIT')
    await this.pool.release()
  }

  async rollback() {
    await this.pool.execute('ROLLBACK')
    await this.pool.release()
  }
}

class Mysql {
  connection = null

  /**
   * @param {PoolOptions} opts
   */
  init(opts) {
    if (!this.connection) {
      this.connection = createPool(opts)
    }
  }

  /**
   * @param {String} sql
   * @param {Array} values
   */
  query(sql, values) {
    this.connection.p
    return this.connection.execute(sql, values)

  }

  async beginTransaction() {
    const pool = await this.connection.getConnection()
    return new Transaction(pool)
  }
}

module.exports = new Mysql()
