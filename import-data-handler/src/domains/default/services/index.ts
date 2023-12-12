import { QueuePlugin } from "../../../support/plugins/queue"
import { customerServices } from "./customerServices"
import { pmcServices } from "./pmcServices"
import { productServices } from "./productServices"
import { productsToErpServices } from "./productToErpServices"

export const handlerServices = async () => {
  QueuePlugin.on('handle-import-pmc', pmcServices)
  QueuePlugin.on('erp-update', productsToErpServices)
  QueuePlugin.on('handle-import-product', productServices)
  QueuePlugin.on('handle-import-customer', customerServices)

  // consumers
  await QueuePlugin.consume('erp-update')
  await QueuePlugin.consume('handle-import-pmc')
  await QueuePlugin.consume('handle-import-product')
  await QueuePlugin.consume('handle-import-customer')
}

