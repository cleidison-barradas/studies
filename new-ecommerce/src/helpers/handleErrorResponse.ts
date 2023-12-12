import { ApiErrorResponse } from 'apisauce'

export function handleErrorResponse(res: ApiErrorResponse<any>) {
  const error = new Error('erro na requisicao')
  error.message = res.data.error
  throw error
}
