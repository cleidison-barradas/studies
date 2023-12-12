/* eslint-disable @typescript-eslint/no-explicit-any */
import { ORM, OrderRepository, StoreRepository, Order } from '@mypharma/api-core'
import { build } from '../../domains/store/helpers/Xls'
import { put } from '../aws'
import { endOfDay, format, startOfDay } from 'date-fns'
const { GMV_REPORT_FILE } = process.env

import ImageCreateService from '../../domains/image/services/ImageCreateService'
import ImageGetByKeyService from '../../domains/image/services/ImageGetBykeyService'
import ImageUpdateService from '../../domains/image/services/ImageUpdateService'
import { QueuePluginGMV } from '../../helpers/queue'


const imageCreateService = new ImageCreateService()
const imageUpdateService = new ImageUpdateService()
const imageGetByKeyService = new ImageGetByKeyService()

const parsedMoney = (float: number) => {
  const money = float.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `R$ ${money}`
}

const convertOrigin = (origin: string) => {
  const data: Record<string, string> = {
    all: 'E-commerce e iFood',
    ecommerce: 'E-commerce',
    ifood: 'iFood'
  }
  return data[origin]
}

export const gmvService = async (): Promise<void> => {

  await QueuePluginGMV.on('gmv-report', async ({ data, msg }: any) => {
    try {

      let totalSale = 0
      const report = []
      const orders: Order[] = []

      const { origin = 'all', startDate, endDate } = data.content

      const where: Record<string, any> = {}

      if (startDate && endDate) {

        where['createdAt'] = {
          $gte: startOfDay(new Date(startDate)),
          $lte: endOfDay(new Date(endDate))
        }
      }

      const stores = await StoreRepository.repo().find({ select: ['tenant', 'settings'] })

      for await (const store of stores) {
        await ORM.setup(null, store.tenant)
        let total = 0

        let data = await OrderRepository.repo(store.tenant).find({
          where,
          select: ['totalOrder', 'createdAt', 'prefix']
        })

        if (data.length > 0) {
          data = data.filter(order =>
            origin === 'all' ||
            (origin === 'ecommerce' && order.prefix !== 'iFood') ||
            order.prefix.toString().toLowerCase() === String(origin).toLowerCase())

          data.forEach(x => total += Number(x.totalOrder))
          const storeCNPJ = String(store.settings['config_cnpj']).replace(/\D+/g, '')
          const storeUrl = String(store.settings['config_url'])

          report.push({
            storeCNPJ,
            storeUrl,
            origin: convertOrigin(origin),
            total: parsedMoney(total),
            period: `${format(startOfDay(new Date(startDate)), 'dd/MM/yyyy')} - ${format(endOfDay(new Date(endDate)), 'dd/MM/yyyy')}`,
            totalSale: ''
          })

          orders.push(...data)
        }
      }

      orders.forEach(order => totalSale += Number(order.totalOrder))

      report.push({
        storeCNPJ: '',
        storeUrl: '',
        origin: '',
        total: '',
        period: '',
        totalSale: parsedMoney(totalSale)
      })

      const content = build(report, 'gmv')

      const path = `reports/${GMV_REPORT_FILE}`

      await put(path, {
        content,
        name: 'gmv',
        type: 'xlsx',
        url: path
      })

      let file = await imageGetByKeyService.getImageByKey({ key: GMV_REPORT_FILE })

      if (file) {

        file = await imageUpdateService.imageUpdate({ file })

      } else {

        file = await imageCreateService.imageCreate({
          url: GMV_REPORT_FILE,
          key: GMV_REPORT_FILE,
          folder: GMV_REPORT_FILE,
          name: GMV_REPORT_FILE,
        })
      }

      await QueuePluginGMV.ack('gmv-report', msg)

    } catch (error) {
      console.log(error)

      await QueuePluginGMV.ack('gmv-report', msg)
    }
  })
  await QueuePluginGMV.consume('gmv-report')
}
