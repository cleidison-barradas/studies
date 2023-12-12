/* eslint-disable @typescript-eslint/no-explicit-any */
import { Address, Customer, CustomerRepository, StoreRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'

export function getCustomer(tenant: string, _id: any) {
  return CustomerRepository.repo<CustomerRepository>(tenant).findById(_id)
}

export async function getStoreByTenant(tenant: string) {
  const store = await StoreRepository.repo<StoreRepository>().findOne({
    select: ['name', 'url', 'settings'],
    where: {
      tenant: tenant,
    },
  })
  return store
}

export function saveCustomer(tenant: string, customer: Customer) {
  return CustomerRepository.repo<CustomerRepository>(tenant).save(customer)
}

export function updateCostumer(tenant: string, customer: Customer) {
  return CustomerRepository.repo<CustomerRepository>(tenant).updateOne({ _id: customer._id }, { $set: customer })
}

export function addCustomerAddress(tenant: string, customer: Customer['_id'], address: any) {
  return CustomerRepository.repo<CustomerRepository>(tenant).updateOne(
    { _id: new ObjectId(customer as any) },
    {
      $addToSet: {
        addresses: {
          _id: new ObjectId(address._id.toString()),
          ...address
        },
      },
    }
  )
}

export function deleteCustomerAddress(tenant: string, customer_id: any, address_id: string) {
  return CustomerRepository.repo<CustomerRepository>(tenant).updateOne(
    {
      '_id': new ObjectId(customer_id.toString()),
    },
    {
      $pull: {
        addresses: {
          $or: [
            { _id: new ObjectId(address_id) },
            { _id: address_id.toString() }
          ]
        },
      },
    }
  )
}

export function UpdateCustomerAddress(tenant: string, customerId: string, addressId: string, data: Partial<Address>) {
  return CustomerRepository.repo(tenant).updateOne(
    {
      _id: new ObjectId(customerId.toString()),
    },
    { $set: { 'addresses.$': { ...data, _id: new ObjectId(data._id.toString()) } } }
  )
}
