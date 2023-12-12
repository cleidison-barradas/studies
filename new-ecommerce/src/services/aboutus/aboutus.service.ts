import { siteApi } from '../../config/api'
import { IAboutUsResponse } from './response.interface'
import { handleErrorResponse } from '../../helpers/handleErrorResponse'

export async function GetStoreAboutUs() {
  return siteApi
    .get<IAboutUsResponse>(`/v2/about-us`)
    .then((res) => res.data)
    .catch(handleErrorResponse)
}
