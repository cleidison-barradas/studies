import { PagseguroOrder, PagseguroOrderRepository, HistoryOrder, HistoryOrderRepository, PaymentMethodRepository, OrderRepository, Order, StatusOrder, StatusOrderRepository, PicpayOrder, PicpayOrderRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'

export function GetPaymentOption(tenant: string, id: string) {
  return PaymentMethodRepository.repo<PaymentMethodRepository>(tenant).findById(id)
}

export function UpdateOrder(tenant: string, id: string, data: Partial<Order>) {
  return OrderRepository.repo<OrderRepository>(tenant).findOneAndUpdate(
    { $or: [{ _id: new ObjectId(id) }, { _id: id }] },
    { $set: data },
  )
}

export function UpdateOrderPagseguro(tenant: string, id: string, data: Partial<PagseguroOrder>) {
  return PagseguroOrderRepository.repo<PagseguroOrderRepository>(tenant).updateOne(
    { $or: [{ "order._id": new ObjectId(id) }, { "order._id": id }] },
    { $set: data },
  )
}

export function UpdateOrderPicpay(tenant: string, id: string, data: Partial<PicpayOrder>) {
  return PicpayOrderRepository.repo<PicpayOrderRepository>(tenant).findOneAndUpdate(
    { $or: [{ "order._id": new ObjectId(id) }, { "order._id": id }] },
    { $set: data },
  )
}

export function AddOrderLog(tenant: string, data: Partial<HistoryOrder>) {
  return HistoryOrderRepository.repo<HistoryOrderRepository>(tenant).save(data)
}

export function GetPagseguroOrder(tenant: string, pagseguroId: string) {
  return PagseguroOrderRepository.repo<PagseguroOrderRepository>(tenant).findOne({ pagseguroId })
}

export function GetOrderStatus() {
  return StatusOrderRepository.repo<StatusOrderRepository>().find()
}

export function GetPicpayOrder(tenant: string, id: string) {
  return PicpayOrderRepository.repo<PicpayOrderRepository>(tenant).findOne({
    where: {
      $or: [{ "order._id": new ObjectId(id) }, { "order._id": id }]
    }
  })
}

export function GetPagseguroOrderByOrderId(tenant: string, orderId: string) {
  return PagseguroOrderRepository.repo<PagseguroOrderRepository>(tenant).findOne({
    where: {
      $or: [{ "order._id": new ObjectId(orderId) }, { "order._id": orderId }]
    }
  })
}