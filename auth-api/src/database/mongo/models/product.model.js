/* eslint-disable func-names */
const { Schema } = require('mongoose');
const BaseModel = require('./internals/model-base');

class Product extends BaseModel {
  constructor() {
    super();
    this.schemaName = 'product';
    this.softDelete = true;

    this.schemaDefinition = new Schema({
      EAN: {
        type: String,
        index: { unique: true }
      },
      MS: {
        type: String,
      },
      name: {
        type: String,
        required: true,
        index: { unique: false }
      },
      presentation: {
        type: String,
      },
      description: {
        type: String
      },
      updatedBy: {
        type: String,
        enum: ["support", "store"],
        default: 'store'
      },
      price: Number,
      model: String,
      image: Object,
      control: Object,
      quantity: Number,
      pmcPrice: Number,
      category: {
        type: Array,
        default: []
      },
      metaTitle: String,
      manufacturer: Object,
      classification: Object,
      metaDescription: String,
      activePrinciple: {
        type: String,
        index: { unique: false }
      },
      specials: [
        {
          category: {
            type: Array,
            default: []
          },
          classification: {
            type: Array,
            default: []
          },
          typePromotion: {
            type: String,
            enum: ["product", "category", "classification"],
            default: "product"
          },
          typeDiscount: {
            type: String,
            enum: ["pricePromotion", "discountPromotion"],
            default: "pricePromotion"
          },
          discountPercentage: Number,
          price: Number,
          date_start: {
            type: Date,
            default: Date.now,
          },
          date_end: {
            type: Date,
            default: Date.now,
          },
          quantityBlock: {
            type: Boolean,
            default: false,
          },
          AllChecked: {
            type: Boolean,
            default: false,
          }
        }
      ],
      status: {
        type: Boolean,
        default: true,
        index: { unique: false }
      },
      verify: {
        type: Boolean,
        default: false,
      },
      slug: {
        type: Array,
        default: [],
        index: { unique: true }
      },
      manualPMC: {
        type: Boolean,
        default: false
      },
      pmcValues: {
        type: Array,
        default: [],
      },
      priceLocked: {
        type: Boolean,
        default: false
      },
      quantityLocked: {
        type: Boolean,
        default: false
      },
      width: {
        type: Number,
        default: 0
      },
      weight: {
        type: Number,
        default: 0.0
      },
      length: {
        type: Number,
        default: 0
      },
      height: {
        type: Number,
        default: 0
      },
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
