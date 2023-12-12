import { Address, Cart, Customer, DeliveryFee, DistanceDeliveryFee, PaymentMethod } from "@mypharma/api-core"

export interface AddressServiceRepository {
  findOne(id: string): Promise<Address>
  createDoc(address: Address): Promise<Address>
}

export interface CartServiceRepository {
  findOne(id: string): Promise<Cart>
  updateOne(cart: Cart): Promise<Cart>
  createDoc(cart: Cart): Promise<Cart>
}

export interface CustomerServiceRepository {
  findOne(id: string): Promise<Customer>
  createDoc(customer: Customer): Promise<Customer>
}

export interface PaymentMethodServiceRepository {
  findById(id: string): Promise<PaymentMethod>
  createDoc(customer: PaymentMethod): Promise<PaymentMethod>
}

export interface DeliveryFeeServiceRepository {
  findOne(neighborhoodId: string): Promise<DeliveryFee | null>
  createDoc(deliveryFee: DeliveryFee): Promise<DeliveryFee>
}

export interface DistanceDeliveryFeeServiceRepository {
  find(): Promise<DistanceDeliveryFee | null>
  findOne(distance: number): Promise<DistanceDeliveryFee | null>
  createDoc(deliveryFee: DistanceDeliveryFee): Promise<DistanceDeliveryFee>
}