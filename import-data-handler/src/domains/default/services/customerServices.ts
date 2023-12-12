import { colors, logger, ORM } from "@mypharma/api-core"
import RedisPlugin from "../../../support/plugins/redis"
import { IIimportData } from '../../../interfaces/import'
import { IImportCustomer } from "../../../interfaces/customer"
import { QueuePlugin } from "../../../support/plugins/queue"
import { customerService } from "../../customer/services/CustomerService"

import ImportUpdateService from "../../import/services/ImportUpdateService"
const importUpdateService = new ImportUpdateService()

export const customerServices = async ({ data, msg }: any) => {
  const { tenant, redisKey, importId } = data.content as IIimportData

  try {

    if (!tenant || !redisKey) {

      throw new Error('missing_tenant_or_redisKey')
    }

    await ORM.setup(null, tenant)

    const customers = await RedisPlugin.get<Array<IImportCustomer>>(redisKey)

    if (!customers || customers.length <= 0) {

      throw new Error('customer_data_not_provided')
    }

    logger(`processing ${customers.length} customers on ${tenant}`, colors.FgYellow)

    const inserted = await customerService(customers, tenant)

    await RedisPlugin.delete(redisKey)

    await importUpdateService.execute({
      tenant,
      importId,
      status: 'finished',
      failures: customers.length - inserted,
      processed: inserted
    })

    await QueuePlugin.ack('handle-import-customer', msg)

  } catch (error) {
    console.log(error.message)

    if (redisKey) await RedisPlugin.delete(redisKey)

    if (importId) {
      await importUpdateService.execute({
        status: 'failure',
        failures: 0,
        processed: 0,
        tenant: data.content.tenant,
        importId: data.content.import,
      })
    }

    await QueuePlugin.ack('handle-import-customer', msg)
  }

}