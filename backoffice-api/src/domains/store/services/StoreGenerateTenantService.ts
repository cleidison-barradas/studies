/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { parse } from 'tldts'

interface StoreGenerateTenantServiceDTO {
  url: string
}

class StoreGenerateTenantService {
  constructor(private repository?: any) { }

  public generateTenantStore({ url }: StoreGenerateTenantServiceDTO) {
    const { subdomain, domain, publicSuffix } = parse(url)
    const tenant = subdomain.concat(domain.replace('.' + publicSuffix, ''))

    return tenant
  }
}

export default StoreGenerateTenantService