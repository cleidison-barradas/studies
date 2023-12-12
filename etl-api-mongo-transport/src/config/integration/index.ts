import { IntegrationConfig } from '@mypharma/etl-engine'

const {
  ETL_CREATE_PRODUCT
} = process.env

export default {
  createProduct: Number(ETL_CREATE_PRODUCT) === 1
} as IntegrationConfig
