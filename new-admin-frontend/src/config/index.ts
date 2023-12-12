const {
  REACT_APP_AUTH_API,
  REACT_APP_MASTER_API,
  REACT_APP_XLS_IMPORT_API,
  REACT_APP_S3_BUCKET,
  REACT_APP_IMPORT_API,
  REACT_APP_CUSTOMERX_TOKEN,
  REACT_APP_CUSTOMERX_HASH,
  REACT_APP_API_SHIPPING,
  REACT_APP_MELHOR_ENVIO_URL,
  REACT_APP_ORDERS_TO_ERPS,
  REACT_APP_MELHOR_ENVIO_MODULE,
  REACT_APP_WORKER_FATURAGIL_API,
} = process.env

export const AuthApi = REACT_APP_AUTH_API || 'http://localhost:8081/'
export const BaseApi = REACT_APP_MASTER_API || 'http://localhost:8082/'
export const XlsImportApi = REACT_APP_XLS_IMPORT_API || 'http://localhost:5199/v2'
export const BucketS3 = REACT_APP_S3_BUCKET || 'https://s3-us-west-2.amazonaws.com/myp-public'
export const ImportApi = REACT_APP_IMPORT_API || 'http://localhost:7203/'
export const CustomerxToken = REACT_APP_CUSTOMERX_TOKEN || null
export const CustomerxHash = REACT_APP_CUSTOMERX_HASH || ''
export const ApiShipping = REACT_APP_API_SHIPPING || 'https://correios.api.mypharma.com.br/'
export const MelhorEnvioBaseUrl = REACT_APP_MELHOR_ENVIO_URL || 'https://melhorenvio.com.br/'
export const BaseApiOrdersToErps = REACT_APP_ORDERS_TO_ERPS || 'https://erp.orders.mypharma.com.br/'
export const MelhorEnvioModule = REACT_APP_MELHOR_ENVIO_MODULE || 'melhor-envio'
export const workerFaturAgilApi = REACT_APP_WORKER_FATURAGIL_API || 'http://localhost:3331'
