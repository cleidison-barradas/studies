import { PagseguroOrder, PagseguroOrderRepository } from "@mypharma/api-core"

interface PagseguroCreateOrderServiceDTO {
  tenant: string
  pagseguroOrder: PagseguroOrder
}

class PagseguroCreateOrderService {

  public async execute({ tenant, pagseguroOrder }: PagseguroCreateOrderServiceDTO) {

    return PagseguroOrderRepository.repo(tenant).createDoc(pagseguroOrder)
  }
}

export default PagseguroCreateOrderService