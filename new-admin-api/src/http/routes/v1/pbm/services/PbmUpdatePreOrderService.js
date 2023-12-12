const { Model } = require('mongoose')

class PbmUpdatePreOrderService {

  /**
   * @param {Model} model 
   */
  constructor(model) {
    this._model = model
  }

  /**
   * @param {object} params - params
   * @param {object} params.pbmOrder - pmb order
   */
  async updatePbmOrder({ pbmOrder }) {
    const _id = pbmOrder._id
    delete pbmOrder._id
    pbmOrder.updatedAt = new Date()

    await this._model.updateOne({ _id }, { $set: { ...pbmOrder } })


    return this._model.findById(_id)

  }
}

module.exports = PbmUpdatePreOrderService