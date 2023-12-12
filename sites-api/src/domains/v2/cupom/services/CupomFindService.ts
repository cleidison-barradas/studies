import { Cupom, CupomRepository } from '@mypharma/api-core'
import moment = require('moment')

interface RequestFindCupomDTO {
  code: string,
  tenant: string
}

class CupomFindService {

  public async execute({ code = '', tenant }: RequestFindCupomDTO) {
    let cupom = new Cupom()
    const today = moment()

    cupom = await CupomRepository.repo(tenant).findOne({
      where: {
        code: code.replace(/\s/g, ''),
        status: true
      }
    })

    if (!cupom) {

      throw Error('cupom_not_found')
    }

    if (!today.isBetween(cupom.initialDate, cupom.finalDate)) {

      throw Error('cupom_expired')
    }

    return cupom
  }
}

export default CupomFindService