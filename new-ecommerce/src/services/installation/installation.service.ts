import { siteApi } from '../../config/api'
import { handleErrorResponse } from '../../helpers/handleErrorResponse'
import { PutStoreAppInstallResponse } from './response.interface'

export async function putStoreAppInstall(data: {userAgent: string, tenant: string}) {
  return siteApi
    .put<PutStoreAppInstallResponse>('v2/store/pwainstallation', data)
    .then((res) => res.data)
    .catch(handleErrorResponse)
}
