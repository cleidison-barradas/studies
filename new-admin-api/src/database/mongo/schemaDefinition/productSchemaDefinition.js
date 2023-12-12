const { Schema } = require('mongoose')

const productSchemaDefinition = new Schema({
    EAN: {
      type: String,
    },
    MS: {
      type: String,
    },
    name: {
      type: String,
      required: true,
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
    },
    verify: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: Array,
      default: []
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
  })

  productSchemaDefinition.pre("findOneAndUpdate", function () {
    const { withDeleted } = this.options
    if (withDeleted) {
      delete this.getFilter().deleted
    }
  })

  module.exports = productSchemaDefinition