/* eslint-disable no-unused-vars */
// MongoDB Schema
const { Model: MongooseModel } = require('mongoose')
const SoftDelete = require('mongoose-delete')

class Model {

  _configureSchema() {
    if(this.softDelete) {

      this.schemaDefinition.plugin(SoftDelete, {
        deletedAt: true,
        overrideMethods: 'all',
      })
    }

    this.schemaDefinition.pre("find", function () {
      const { withDeleted } = this.options;
      if (withDeleted) {
        delete this.getFilter().deleted;
      }
    })
  }

  /**
   * Internal model definition
   *
   * @param {MongooseModel} model
   */
  _setModel(model) {
    this._model = model;
  }

  /**
   * Get model
   *
   * @returns {MongooseModel}
   */
  Model() {
    return this._model;
  }
}

module.exports = Model;
