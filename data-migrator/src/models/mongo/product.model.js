const { Schema } = require('mongoose');
const BaseModel = require('./internals/model-base');

class Product extends BaseModel {
  constructor() {
    super();
    this.schemaName = 'product'
    this.softDelete = true

    this.schemaDefinition = new Schema({
      imageUrl: {
        type: String,
        default: null
      },
      originalId: {
        type: Number,
        default: null
      },
      originalControlId: {
        type: Number,
        default: null
      },
      originalManufacturerId: {
        type: Number,
        default: null
      },
      originalClassificationId: {
        type: Number,
        default: null
      },
      EAN: {
        type: String,
      },
      MS: {
        type: String,
      },
      name: {
        type: String,
      },
      model: {
        type: String,
      },
      presentation: {
        type: String,
      },
      description: {
        type: String
      },
      category: [
        {
          type: Object,
          default: null,
        }
      ],
      manufacturer: {
        type: Object,
        default: null
      },
      classification: {
        type: Object,
        default: null
      },
      control: {
        type: Object,
        default: null
      },
      image: {
        type: Object,
        default: null
      },
      slug: {
        type : Array,
        default : []
      },
      activePrinciple: {
        type: String,
        default: null
      },
      status: {
        type: Boolean,
        default: true,
      },
      verify: {
        type: Boolean,
        default: false,
      },
      quantity: {
        type: Number,
        default: 0
      },
      price: {
        type: Number,
        default: 0
      },
      cached: {
        type: Boolean,
        default: false
      },
      specials: {
        type: Array,
        default: []
      },
      manualPMC: {
        type: Boolean,
        default: false
      },
      pmcPrice: Number,
      metaTitle: String,
      metaKeyword: String,
      metaDescription: String,
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });

    this._configureSchema();
  }
}
module.exports = new Product()
