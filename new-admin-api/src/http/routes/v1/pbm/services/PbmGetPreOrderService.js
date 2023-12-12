const { Model: MongooseModel } = require('mongoose')

class PbmGetOrderService {
  /**
   * 
   * @param {MongooseModel} repository
   */
  constructor(repository) {
    this._repository = repository
  }

  /**
   * get PBM pre order by orderId
   * 
   * @param {String} orderId 
   * 
   */
  async getPreOrder(orderId) {

    const order = await this._repository.findOne({ orderId })

    return order
  }
}


module.exports = PbmGetOrderService