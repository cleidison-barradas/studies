import { Store, Order, PaymentMethodRepository, StatusOrderRepository, OrderRepository, HistoryOrderRepository } from '@mypharma/api-core'
import { orderParser } from './dataParser'
import { CreateOrder } from './requests'

export default class StoneService {
  stone_key: string

  async authentication(store: Store, base_method: string) {
    const methods = await PaymentMethodRepository.repo(store.tenant).find()
    const stone_method = methods.filter((x) => {
      return x.paymentOption.name === base_method
    })
    const SECRET_TEST_KEY = String(stone_method[0].extras[0]).trim()
    const stone_key = Buffer.from(SECRET_TEST_KEY + ':')
      .toString('base64')
      .replace(' ', '')
    return stone_key
  }

    async createOrder(order: Order, store:Store, stone_card: string, installment: number, cpf:string) {
        try {
            const stone_key = await this.authentication(store, "Stone")
            const parsedOrder = await orderParser(order, store, cpf, stone_card, installment)
            const res = await CreateOrder(parsedOrder, stone_key, store)
            if(res !== undefined){
                return res.data
            } else {
                throw new Error("Response indefinida")
            }
        } catch (error) {
            if(error.response !== undefined){
                throw (error.response.data.errors)
            } else {
                throw (error)
            }
        }
    }

  async updateOrder(order: Order, store: Store){
    console.log("Rejeitando pedido Stone")
    const tenant = store.tenant
    const statusOrder = await StatusOrderRepository.repo().findOne({ type: "rejected" })
    await OrderRepository.repo(tenant).updateOne({_id : order._id}, { $set: { statusOrder }})
    await HistoryOrderRepository.repo(tenant).insertOne({
      notify: true,
      deleted: false,
      order: order,
      status: statusOrder,
      comments: 'Pedido pejeitado pela Stone.',
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  async createTicketOrder(order: Order, store: Store, cpf: string) {
    try {
      const stone_key = await this.authentication(store, 'Boleto')
      const parsedOrder = orderParser(order, store, cpf)
      const res = await CreateOrder(parsedOrder, stone_key, store)
      return res
    } catch (error) {
        if(error.response !== undefined){
          throw (error.response.data.errors)
      } else {
          throw (error)
      }
    }
  }
}
