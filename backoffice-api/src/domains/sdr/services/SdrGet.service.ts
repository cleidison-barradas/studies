/* eslint-disable @typescript-eslint/no-explicit-any */
import { Sdr, SdrRepository } from '@mypharma/api-core'
import { FindManyOptions } from 'typeorm'
import { IGetSdrRequest } from '../interfaces/sdr.request'


export default async function getSdrsAndCountService({ search = '', status = undefined, limit = 20, page = 1 }: IGetSdrRequest): Promise<[Sdr[], number]> {
  const where: Record<any, any> = {}

  if (search) {
    where['$or'] = [
      { name: new RegExp(search, 'gi') },
      { email: new RegExp(search, 'gi') },
    ]
  }

  const optionsOrConditions: FindManyOptions<Sdr> = {
    where,
    take: Number(limit),
    skip: Number(limit) * (Number(page) - 1),
  }

  // eslint-disable-next-line prefer-const
  let [sdrs, total] = await SdrRepository.repo().findAndCount(optionsOrConditions)

  if (status) {
    sdrs = sdrs.filter(sdr => `${sdr.willReceveLeadsEmail}` === status)
  }

  return [sdrs, total]
}
