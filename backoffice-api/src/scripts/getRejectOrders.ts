import { getAllOrderNumbers, getAllRejectedOrderNumbers } from './utils/order.util'
import getAllStores  from './utils/store.util'

const getRejectOrders = async ():Promise<void> => {

  let allOrders = 9118
  let rejectedOrders = 389
    
  const stores = await getAllStores()
  for(const store of stores){
    const storeAllOrders = await getAllOrderNumbers(store.tenant)
    const storeRejectedOrders = await getAllRejectedOrderNumbers(store.tenant)
    allOrders += storeAllOrders
    rejectedOrders += storeRejectedOrders
  }

  const percentage = ( rejectedOrders / allOrders ) * 100
  console.log(`${percentage.toPrecision(2)}%`)


}

export default getRejectOrders