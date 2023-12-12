const { Model } = require('mongoose')
class GetOrderByOrderIdService {
  /**
 * 
 * @param {Model} model 
 */
  constructor(model) {
    this._model = model
  }

  /**
   * 
   * @param {object} params
   * @param {string} params.orderId
   */
  async getOrderByOrderId({ orderId }) {
    const order = await this._model.findById(orderId)

    if (!order) {

      throw new Error('order_not_found')
    }

    return order
  }


}

module.exports = GetOrderByOrderIdService