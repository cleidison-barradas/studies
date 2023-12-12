const MysqlPlugin = require('../plugins/mysql')

class BaseRepository {
  tableName = null
  constructor(tableName) {
    this.tableName = tableName
  }

  async query(sql, values) {
    const transaction = await MysqlPlugin.beginTransaction()

    try {
      const result = await transaction.query(sql, values)
      await transaction.commit()

      return result
    } catch (error) {
      console.log(error)
      console.log(`SQL ${sql}`)
      await transaction.rollback()
    }
  }
}

module.exports = BaseRepository
