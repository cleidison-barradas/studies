import { StoreRepository } from "@mypharma/api-core"

interface StoreGetStoreByUrlServiceDTO {
  urls: string[]
}

class StoreGetStoreByUrlService {
  constructor(private repository?: any) { }

  public async getStoresByUrl({ urls = [] }: StoreGetStoreByUrlServiceDTO) {
    const where: Record<string, any> = {}

    if (urls.length > 0) {
      where['url'] = { $in: urls }
    }

    return StoreRepository.repo().find({ where, select: ['tenant', 'url'] })
  }
}

export default StoreGetStoreByUrlService