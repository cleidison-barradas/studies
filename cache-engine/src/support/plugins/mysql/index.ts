import { createPool, PoolOptions, Pool, PoolConnection, escape, format } from 'mysql2/promise'

export { PoolOptions, Pool, ResultSetHeader } from 'mysql2/promise'

class Transaction {
  constructor(private pool: PoolConnection) {}

  public query(sql: string, values: any = []) {
    return this.pool.execute(sql, values)
  }

  public async commit() {
    await this.pool.execute('COMMIT')
    await this.pool.release()
  }

  public async rollback() {
    await this.pool.execute('ROLLBACK')
    await this.pool.release()
  }
}

class MySQL {
  private connection: Pool

  public init(config: PoolOptions) {
    if (!this.connection) {
      this.connection = createPool(config)
    }
  }

  public query(sql: string, values: any = []) {
    return this.connection.execute(sql, values)
  }

  public async beginTransaction() {
    const pool = await this.connection.getConnection()
    return new Transaction(pool)
  }

  public escape(value: any) {
    return escape(value)
  }

  public format(str: string, values: any[]) {
    return format(str, values)
  }
}

export const MySQLPlugin = new MySQL()
