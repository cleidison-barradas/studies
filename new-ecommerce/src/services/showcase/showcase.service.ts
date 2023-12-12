import { siteApi } from '../../config/api'
import { handleErrorResponse } from '../../helpers/handleErrorResponse'
import { GetShowcaseResponse } from './response.interface'

export async function getShowcase() {
  return siteApi
    .get<GetShowcaseResponse>('/v2/showcase')
    .then((res) => res.data)
    .catch(handleErrorResponse)
}
