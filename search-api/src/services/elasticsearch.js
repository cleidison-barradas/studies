// Sentry
const Sentry = require('@sentry/node')

// ElasticSearch
const ElasticSearch = require('@elastic/elasticsearch')

const { v4, validate } = require('uuid')

// Config
const { elasticsearchConfig } = require('../config')

// Create Client
const client = new ElasticSearch.Client({
  node: elasticsearchConfig.host,
  auth: elasticsearchConfig.auth
})

const exists = async ({ storeId, prefix = 'store' }) => {
  try {

    const index = `${prefix}_${storeId}`

    return client.indices.exists({
      index
    })

  } catch (err) {
    console.log(err)
    Sentry.captureException(err)
  }
}

/**
 * 
 * @param {Object} options 
 * @param {string} options.default_index 
 * @param {string} options.storeId 
 * @param {string} options.prefix 
 * 
 */
const getBySlug = async ({ slug, prefix = 'store', tenant }) => {
  try {
    const index = `${prefix}_${tenant}`

    return client.search({
      index,
      query: {
        match: {
          slug
        }
      }
    })

  } catch (err) {
    Sentry.captureException(err)
    console.log(err.meta.body.error)
    return {
      body: {
        hits: {
          hits: []
        }
      }
    }
  }
}



/**
 * 
 * @param {Object} options 
 * @param {string} options.default_index 
 * @param {string} options.query 
 * @param {string} options.storeId 
 * @param {number} options.size
 * @param {string} options.prefix 
 * 
 */
const search = async ({ query, storeId, size, default_index = '', prefix = 'store' }) => {
  try {
    const indexes = []
    const index = `${prefix}_${storeId}`

    // Escape query
    query = query.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\W_]+/g, ' ').toLowerCase()

    const body = {
      query: {
        bool: {
          should: [],
        }
      }
    }

    // Filter by query strig
    if (query.trim().length > 0) {
      if (isNaN(query)) {
        body.query.bool.should.push(
          {
            fuzzy: {
              name: {
                value: query,
                fuzziness: 'AUTO'
              }
            }
          }, {
          query_string: {
            query: query + '*',
            fields: ['name'],
            fuzziness: 'AUTO'
          }
        }
        )
      } else {
        body.query.bool.should.push({
          multi_match: {
            query: query,
            fields: ['ean', 'product_id']
          }
        })
      }
      body.query.bool['minimum_should_match'] = 1
      body.query.bool['filter'] = [
        {
          term: {
            status: true
          }
        },
        {
          range: {
            quantity: {
              gt: 0
            }
          }
        }
      ]
    }

    indexes.push(index)

    if (default_index.length > 0) {
      indexes.push(`${prefix}_${default_index}`)
    }

    return client.search({
      index: indexes,
      body: body,
      size: size,
    })

  } catch (err) {
    Sentry.captureException(err)
    console.log(err.meta.body.error)

    return {
      body: {
        hits: {
          hits: []
        }
      }
    }
  }
}

/**
 * @param {object} params
 * @param {string} params.text
 * @param {string} params.prefix
 * @param {string} params.storeId
 */
const suggestion = async ({ text, storeId, prefix = 'mongo_store_suggest' }) => {
  try {
    text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\W_]+/g, ' ').toLowerCase()

    return client.search({
      index: `${prefix}_${storeId}`,
      _source: ['ean'],
      suggest: {
        medicine_suggestions: {
          prefix: text,
          completion: {
            field: 'name',
            skip_duplicates: true,
            fuzzy: {
              fuzziness: 'AUTO'
            }
          }
        }
      }
    })

  } catch (error) {
    console.log(error)
    return {
      body: {
        hits: {
          hits: []
        },
        suggest: {
          medicine_suggestions: []
        }
      }
    }
  }
}

/**
 * 
 * @param {Object} options 
 * @param {string} options.text 
 * @param {string} options.storeId 
 * @param {string} options.size
 * @param {string} options.prefix 
 * 
 */
const semanticSearch = async ({ text, storeId, size = 500, prefix = 'mongo_store' }) => {
  try {
    text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\W_]+/g, ' ').toLowerCase()

    const body = {
      query: {
        bool: {
          should: [],
        }
      }
    }

    // Filter by query string
    if (text.trim().length > 0) {
      if (isNaN(text)) {
        body.query.bool.should.push(
          {
            fuzzy: {
              name: {
                value: text,
                fuzziness: 'AUTO'
              }
            }
          },
          {
            query_string: {
              query: text + '*',
              fields: ['name'],
              fuzziness: 'AUTO'
            }
          }
        )
      } else {
        body.query.bool.should.push({
          multi_match: {
            query: text,
            fields: ['ean', 'product_id']
          }
        })
      }

      body.query.bool['minimum_should_match'] = 1
      body.query.bool['filter'] = [
        {
          term: {
            status: true
          }
        },
        {
          range: {
            quantity: {
              gt: 0
            }
          }
        }
      ]
    }

    return client.search({
      index: `${prefix}_${storeId}`,
      body: body,
      size: size,
    })

  } catch (error) {
    console.log(error)
    return {
      body: {
        hits: {
          hits: []
        },
        suggest: {
          medicine_suggestions: []
        }
      }
    }
  }
}

const searchAddress = async (query) => {
  try {
    query = query.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    const body = {
      query: {
        simple_query_string: {
          query: query,
          fields: ["body.name^5", "body.city", "body.state_code"],
          default_operator: "and"
        }
      }
    }

    return await client.search({
      index: 'mongo_neighborhood',
      size: 500,
      body: body
    })

  } catch (error) {
    Sentry.captureException(error)

    return {
      body: {
        hits: {
          hits: []
        }
      }
    }
  }
}

const deleteIndex = async ({ prefix = 'mongo_store', storeId }) => {
  try {
    await client.indices.delete({
      index: `${prefix}_${storeId}`
    })

    client.index({
      index: '',
      id: '',
      document: {}
    })

  } catch (err) {
    Sentry.captureException(err)
    console.log(err)
  }
}

/**
 * 
 * @param {object} params
 * @param {string} params.tenant
 * @param {string} params.query
 * @param {string} params.fingerprint
 * @param {string} params.prefix
 * @param {string} params.suggest_type
 * @@returns {Promise<string>}
 */
const searchHistory = async ({ tenant, query, fingerprint = null, prefix = 'mongo_history_search', suggest_type = 'past_searches' }) => {
  try {

    if (!fingerprint || !validate(fingerprint)) {

      fingerprint = v4()
    }

    await client.index({
      index: `${prefix}_${tenant}`,
      document: {
        query,
        fingerprint,
        suggest_type,
        user_id: null,
      }
    })

    return fingerprint

  } catch (err) {
    console.log(err)
    return {
      body: {
        hits: {
          hits: []
        }
      }
    }
  }
}

/**
 * 
 * @param {object} params
 * @param {string} params.tenant
 * @param {string} params.user_id
 * @param {string} params.fingerprint
 * @param {string} params.prefix
 * @param {string} params.suggest_type
 */
const pastSearches = async ({ tenant, user_id = null, fingerprint = null, prefix = 'mongo_history_search', suggest_type = 'past_searches' }) => {

  try {
    const body = {
      query: {
        bool: {
          should: [
            {
              match: {
                fingerprint
              }
            }
          ]
        }
      }
    }

    if (!fingerprint || !validate(fingerprint)) {

      return {
        body: {
          hits: {
            hits: []
          }
        }
      }
    }

    return client.search({
      index: `${prefix}_${tenant}`,
      body: body,
      size: 10
    })

  } catch (err) {
    console.log(err)
    return {
      body: {
        hits: {
          hits: []
        }
      }
    }
  }
}

module.exports = {
  exists,
  search,
  getBySlug,
  suggestion,
  deleteIndex,
  deleteIndex,
  pastSearches,
  searchHistory,
  searchAddress,
  semanticSearch
}