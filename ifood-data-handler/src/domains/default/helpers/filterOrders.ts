import { IIFoodOrder } from "../../../interfaces/ifood.interface";

export const filter = (orders: IIFoodOrder[], storeId: number) => {
  const filtredOrders = new Map<string, IIFoodOrder>([])

  orders.filter(_order => _order.idLoja === storeId && (_order.status.includes('PE0') || _order.status.includes('FIN'))).forEach(order => {

    if (!filtredOrders.has(order.codigoPedido)) {
      filtredOrders.set(order.codigoPedido, order)
    }
  })

  return filtredOrders
}