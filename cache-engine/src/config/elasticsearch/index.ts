import { ClientOptions } from '@elastic/elasticsearch'

const {
  ELASTICSEARCH_HOST,
  ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD
} = process.env

export default {
  node: ELASTICSEARCH_HOST,
  auth: ELASTICSEARCH_USERNAME && ELASTICSEARCH_PASSWORD ? {
    username: ELASTICSEARCH_USERNAME,
    password: ELASTICSEARCH_PASSWORD
  } : null
} as ClientOptions
