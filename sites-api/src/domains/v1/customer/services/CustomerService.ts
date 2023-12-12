/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomerRepository, Customer, FirebaseTokenRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'

export function getCustomer(tenant: string, _id: string) {
  return CustomerRepository.repo<CustomerRepository>(tenant).findById(_id)
}

export function saveCustomer(tenant: string, customer: Customer) {
  return CustomerRepository.repo<CustomerRepository>(tenant).save(customer)
}

export function updateCustomer(tenant: string, _id: any, customer: Partial<Customer>) {
  return CustomerRepository.repo<CustomerRepository>(tenant).findOneAndUpdate(
    { _id: new ObjectId(_id) },
    {
      $set: { ...customer, updatedAt: Date.now() },
    }
  )
}

export async function updateOrCreateFirebaseToken(tenant: string, userID: any, storeID: any, token: string) {
  const checkFirebase = await FirebaseTokenRepository.repo<FirebaseTokenRepository>(tenant).findOne({ userID, storeID })

  if (checkFirebase) {
    await FirebaseTokenRepository.repo<FirebaseTokenRepository>(tenant).updateOne({ userID, storeID }, { $set: { token, updatedAt: Date.now() } })
  } else {
    await FirebaseTokenRepository.repo<FirebaseTokenRepository>(tenant).save({
      userID,
      storeID,
      token,
    })
  }
}

export async function unsubscribeCustomer(tenant: string, email: string) {
  return CustomerRepository.repo<CustomerRepository>(tenant).updateOne(
    {
      email,
    },
    { $set: { subscribed: false } }
  )
}
