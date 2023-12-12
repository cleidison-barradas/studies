/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteWriteOpResultObject, FindManyOptions } from 'typeorm'
import { IntegrationErp, IntegrationErpRepository, IntegrationErpVersion, IntegrationErpVersionRepository } from '@mypharma/api-core'
import { IGetErpRequest } from './interfaces/erp.request'
import { ObjectId } from 'bson'
const { DATABASE_INTEGRATION_NAME } = process.env

export default class ErpService {
  tenant: string = DATABASE_INTEGRATION_NAME

  async getErps(filters: IGetErpRequest): Promise<IntegrationErp[]> {
    const { limit = 20, name = '', page = 1 } = filters

    const query: FindManyOptions<IntegrationErp> = {
      where: {
        name: new RegExp(name, 'gi'),
      },
      take: Number(limit),
      skip: Number(limit) * (Number(page) - 1),
    }

    return IntegrationErpRepository.repo(this.tenant).find(query)
  }

  async getErp(id: string): Promise<IntegrationErp> {
    return IntegrationErpRepository.repo(this.tenant).findById(id)
  }

  async count(filters: IGetErpRequest): Promise<number> {
    const { name = '' } = filters

    return IntegrationErpRepository.repo(this.tenant).count({ name: new RegExp(name, 'gi') })
  }

  async getErpVersion(filters: IGetErpRequest): Promise<IntegrationErpVersion[]> {
    const { limit = 20, name = '', page = 1 } = filters

    const query: FindManyOptions<IntegrationErpVersion> = {
      where: {
        name: new RegExp(name, 'gi'),
      },
      take: Number(limit),
      skip: Number(limit) * (Number(page) - 1),
    }

    return IntegrationErpVersionRepository.repo(this.tenant).find(query)
  }

  async findErpVersions(id: ObjectId[]): Promise<IntegrationErpVersion[]> {
    return IntegrationErpVersionRepository.repo(this.tenant).find({ where: { _id: { $in: id } } })
  }

  async createErp(integrationErp: IntegrationErp): Promise<IntegrationErp> {
    delete integrationErp._id

    const versions = await this.findErpVersions(integrationErp.versions.map((value: any) => new ObjectId(value)))
    integrationErp.createdAt = new Date()
    integrationErp.updatedAt = new Date()
    return IntegrationErpRepository.repo(this.tenant).createDoc({ ...integrationErp, versions })
  }

  async update(integrationErp: Partial<IntegrationErp>): Promise<Partial<IntegrationErp>> {
    const { _id, ...erp } = integrationErp

    const versions = await this.findErpVersions(integrationErp.versions.map((value: any) => new ObjectId(value)))

    await IntegrationErpRepository.repo(this.tenant).updateOne({ _id: new ObjectId(_id as any) }, { $set: { ...erp, versions } })

    return this.getErp(_id as any)
  }

  async remove(_id: string): Promise<DeleteWriteOpResultObject> {
    return IntegrationErpRepository.repo(this.tenant).deleteOne({ _id: new ObjectId(_id) })
  }
}
