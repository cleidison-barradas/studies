import { Client } from '@elastic/elasticsearch'
import { captureException, withScope } from '@sentry/node'
import config from '../../../config/elasticsearch'

export interface BulkData extends Record<string, any> {
  id: string,
  index: IndexOption
}

export interface IndexOption {
  prefix: string,
  id: string
}

class ElasticSearch {
  private client: Client

  constructor() {
    this.client = new Client(config)
  }

  public async bulk(data: BulkData[]) {
    try {
      await this.client.helpers.bulk({
        datasource: data,
        onDocument(doc) {
          return [
            {
              update: {
                _index: `${doc.index.prefix}_${doc.index.id}`,
                _id: doc.id
              }
            },
            {
              doc_as_upsert: true
            }
          ]
        }
      })
      return true
    } catch (err) {
      console.log(err)
      withScope(scope => {
        scope.setContext('bulk', {
          body: JSON.stringify(err.meta.body),
          statusCode: err.meta.statusCode,
          headers: err.meta.headers,
          warnings: err.meta.warnings
        })

        captureException(err)
      })
      return false
    }
  }

  public async create(index: IndexOption, body: any) {
    try {
      await this.client.indices.create({
        index: `${index.prefix}_${index.id}`,
        body: body,
        mappings: {
          properties: {
            id: {
              type: 'text'
            },
            index: {
              type: 'object'
            },
            name: {
              type: 'completion'
            },
            ean: {
              type: 'text'
            },
            price: {
              type: 'double'
            },
            status: {
              type: 'boolean'
            },
            rank: {
              type: 'integer'
            }
          }
        }
      })

      return true
    } catch (err) {
      console.log(JSON.stringify(err))
      captureException(err, {
        contexts: {
          responseError: {
            body: err.meta.body,
            statusCode: err.meta.statusCode,
            headers: err.meta.headers,
            warnings: err.meta.warnings
          }
        }
      })

      return false
    }
  }

  public async update(id: string, data: any, index: IndexOption) {
    try {
      await this.client.update({
        ...this.parsePayload(id, data, index),
        body: {
          doc: data
        }
      })
      return true
    } catch (err) {
      captureException(err, {
        contexts: {
          responseError: {
            body: err.meta.body,
            statusCode: err.meta.statusCode,
            headers: err.meta.headers,
            warnings: err.meta.warnings
          }
        }
      })

      return false
    }
  }

  public async remove(id: string, index: IndexOption) {
    try {
      await this.client.delete({
        id: id,
        index: `${index.prefix}_${index.id}`
      })
      return true
    } catch (err) {
      return false
    }
  }

  public async refresh(id: string, index: IndexOption) {
    try {
      await this.client.indices.refresh({
        index: `${index.prefix}_${index.id}`
      })
      return true
    } catch (err) {
      captureException(err, {
        contexts: {
          responseError: {
            body: err.meta.body,
            statusCode: err.meta.statusCode,
            headers: err.meta.headers,
            warnings: err.meta.warnings
          }
        }
      })

      return false
    }
  }

  public async exists(index: IndexOption) {
    try {

      return this.client.indices.exists({
        index: `${index.prefix}_${index.id}`
      })

    } catch (err) {
      console.log(err)
      return false
    }
  }

  public async updateSettings(index: IndexOption) {
    try {
      // Close index before update
      await this.client.indices.close({
        index: `${index.prefix}_${index.id}`
      })

      await this.client.indices.putSettings({
        index: `${index.prefix}_${index.id}`,
        body: {

        }
      })
    } catch (err) {
      withScope(scope => {
        scope.setContext('updateSettings', {
          body: JSON.stringify(err.meta.body),
          statusCode: err.meta.statusCode,
          headers: err.meta.headers,
          warnings: err.meta.warnings
        })

        captureException(err)
      })

      return false
    }
  }

  public async getSettings(index: IndexOption) {
    try {
      const settings = await this.client.indices.getSettings({
        index: `${index.prefix}_${index.id}`
      })

      if (settings?.body) {
        return settings.body[`${index.prefix}_${index.id}`].settings
      }

      return null
    } catch (err) {
      withScope(scope => {
        scope.setContext('getSettings', {
          body: JSON.stringify(err.meta.body),
          statusCode: err.meta.statusCode,
          headers: err.meta.headers,
          warnings: err.meta.warnings
        })

        captureException(err)
      })

      return null
    }
  }

  private parsePayload(id: string, data: any, index: IndexOption) {
    return {
      id: id,
      index: `${index.prefix}_${index.id}`,
      body: data
    }
  }
}

export default new ElasticSearch()
