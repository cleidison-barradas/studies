import { MySQLPlugin } from '@mypharma/etl-engine'

export interface QueryOptions {
  columns?: string | string[],
  where?: object,
  limit?: number
}

export class BaseRepository<T> {

  constructor(private tableName: string) {}

  public async find(args: QueryOptions): Promise<T[]> {
    const mounted = this.mountSQL(args)
    let query = await MySQLPlugin.query(mounted.sql, mounted.values)
    const result = query.length > 0 ? Object.assign([], query[0]) : null

    query = null
    return result as T[]
  }

  public async findOne(args: QueryOptions): Promise<T | null> {
    args.limit = 1
    const result = await this.find(args)

    return result.length > 0 ? result[0] : null as T
  }

  private mountSQL(args: QueryOptions) {
    let sql = `SELECT ${args?.columns ? args.columns.toString() : '*'} FROM ${this.tableName}`
    const vals = []

    if (args?.where) {
      Object.keys(args.where).forEach(key => {
        const value = args.where[key]

        if (!sql.includes('WHERE')) {
          sql += ' WHERE '
        } else {
          sql += ' AND '
        }

        if (typeof value === 'object') {
          sql += `${key} ${value.op} ?`
          vals.push(value.value)
        } else {
          sql += `${key}=?`
          vals.push(value)
        }
      })
    }

    if (args?.limit) {
      sql += ` LIMIT ${args.limit}`
    }

    return {
      sql,
      values: vals
    }
  }
}
