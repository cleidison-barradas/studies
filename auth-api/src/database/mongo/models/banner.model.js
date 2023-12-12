// MongoDB Schema
const { Schema, Types } = require('mongoose')
const aws = require('aws-sdk');
const config = require('../../../config');
const s3 = new aws.S3(config.s3);

// Base model
const BaseModel = require('./internals/model-base')

class Banner extends BaseModel {
  constructor() {
    super()

    // Schema name
    this.schemaName = 'banner'

    // Definition
    this.schemaDefinition = new Schema({
      description: String,
      image: {
        name: String,
        key: String,
        url: String,
        folder: String,
      },
      updatedAt: {
        type: Date,
        default: Date.now
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    })

    // Schema configuration
    this._configureSchema()
    this.schemaDefinition.pre('remove', async function () {
      const response = await s3
        .deleteObject({
          Bucket: config.s3._bucket,
          Key: this.image.key,
        })
        .promise();
      return response
    });

  }
}

module.exports = new Banner()
