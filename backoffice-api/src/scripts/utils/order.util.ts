import { OrderRepository, ORM } from '@mypharma/api-core'
import moment from 'moment'
const lastMonth = moment('01/01/2023').clone().utc(true).startOf('day').toDate()

console.log(lastMonth)
const getAllOrderNumbers = async(tenant: string): Promise<number> => {
  await ORM.setup(null, tenant)
  const [ orders, orderNumbers ] = await OrderRepository.repo(tenant).findAndCount({
    where: {
      createdAt: { $gte : lastMonth}
    }
  })

  return orderNumbers
}

const getAllRejectedOrderNumbers = async(tenant: string): Promise<number> => {
  await ORM.setup(null, tenant)
    
  const [ orders, orderNumbers ] = await OrderRepository.repo(tenant).findAndCount({
    where: {
      'statusOrder.type' : 'rejected',
      createdAt: { $gte : lastMonth}
    }
  })

  return orderNumbers
}

export { getAllOrderNumbers, getAllRejectedOrderNumbers }