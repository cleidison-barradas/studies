import { userRepository } from '../../repositories/UserRepository'

export const userParser = async (data: any): Promise<any> => {
  let erpVersion = await userRepository.getErpVersion(data.erp_version_id) as any
  if (erpVersion) {
    erpVersion = {
      id: erpVersion.id,
      name: erpVersion.name,
      erp: {
        id: erpVersion.erp_id,
        name: erpVersion.erp_name
      }
    }
  }

  return {
    userId: Number(data.userId),
    token: data.token,
    privateKey: data.privateKey,
    publicKey: data.publicKey,
    store: {
      store_id: data.store_id,
      original_id: data.store_id,
      name: data.store_name,
      url: data.store_url
    },
    erpVersion
  }
}

