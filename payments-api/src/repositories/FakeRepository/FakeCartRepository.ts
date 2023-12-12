import { Cart } from "@mypharma/api-core";
import { CartServiceRepository } from "../internals";

class FakeCartRepository implements CartServiceRepository {
  private carts: Cart[] = []

  async createDoc(cart: Cart): Promise<Cart> {
    this.carts.push(cart)

    return cart
  }

  async findOne(id: string): Promise<Cart | null> {
    const cart = this.carts.find(_cart => _cart._id.toString() === id)

    return cart
  }

  async updateOne(cart: Cart): Promise<Cart> {
    const _id = cart._id.toString()
    const index = this.carts.findIndex(x => x._id.toString() === _id)

    this.carts[index] = cart

    return this.carts[index]
  }

}

export default FakeCartRepository