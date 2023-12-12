/* eslint-disable @typescript-eslint/no-explicit-any */
import { Lead, LeadRepository } from '@mypharma/api-core'
import { FindManyOptions } from 'typeorm'
import { IGetLeadRequest } from './../interface/lead.request'
import { startOfDay, endOfDay } from 'date-fns'


export default async function getLeadsAndCountService({ search = '', startDate, endDate, limit = 20, page = 1, status, ...params }: IGetLeadRequest, report?: boolean): Promise<[Lead[], number]> {
  const where: Record<any, any> = {}

  if (search) {
    where['$or'] = [
      { name: new RegExp(search, 'gi') },
      { email: new RegExp(search, 'gi') },
    ]
  }

  if (startDate && endDate) {
    where['createdAt'] = { $gte: startOfDay(new Date(startDate)), $lte: endOfDay(new Date(endDate)) }
  }

  if (startDate && !endDate) {
    where['createdAt'] = { $gte: startOfDay(new Date(startDate)), $lte: endOfDay(new Date()) }
  }

  if (!startDate && endDate) {
    where['createdAt'] = { $gte: startOfDay(new Date('2000-01-01T00:08:52.308+00:00')), $lte: endOfDay(new Date(endDate)) }
  }

  if (status) {
    where['status'] = status
  }

  Object.keys(params).forEach(key => {
    if (typeof params[key] !== 'undefined' && params[key] !== '' && key !== 'sdrInfo') {
      where[key] = params[key]
    }
  })

  const optionsOrConditions: FindManyOptions<Lead> = {
    where,
    take: report ? null : Number(limit),
    skip: report ? null : Number(limit) * (Number(page) - 1),
  }

  return await LeadRepository.repo().findAndCount(optionsOrConditions)
}
