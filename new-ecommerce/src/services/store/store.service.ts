import { authApi, siteApi } from '../../config/api'
import { handleErrorResponse } from '../../helpers/handleErrorResponse'
import { StartupResponse, IstoreGroupResponse } from './response.interface'


export async function startup() {
  return authApi
    .get<StartupResponse>('/v1/store/startup')
    .then((res) => res.data)
    .catch(handleErrorResponse)
}

export async function storeGroup(url: string | null) {
  return siteApi
    .get<IstoreGroupResponse>(`/v2/store/storeGroup`, {url})
    .then((res) => res.data)
    .catch(handleErrorResponse)
}