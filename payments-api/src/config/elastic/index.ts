
export default {
  host: process.env.ELASTICSEARCH_HOST,
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD
  }
}