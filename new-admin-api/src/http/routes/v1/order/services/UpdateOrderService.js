const { Model } = require('mongoose')

class UpdateOrderService {

  /**
   * 
   * @param {Model} model 
   */
  constructor(model) {
    this._model = model
  }


  /**
   * @param {object} params
   * @param {object} params.order
   * @param {string} params.orderId
   */
  async updateOrder({ order, orderId }) {

    delete order._id
    order.updatedAt = new Date()

    await this._model.updateOne({ _id: orderId }, { $set: { ...order } })

    return this._model.findById(orderId)
  }
}

module.exports = UpdateOrderService