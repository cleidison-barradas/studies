// AWS SDK
const AWS = require('aws-sdk')

// Config
const config = require('../config');

// S3 instance
const s3 = new AWS.S3(config.s3)

/**
 * S3 object type
 * 
 * @typedef S3Object
 * @property {String} data
 * @property {String} contentType
 * @property {String} acl
 */

/**
 * Get object from s3 path
 * 
 * @param {String} path 
 * @returns {S3Object}
 */
const get = async (path) => {
  const obj = await s3.getObject({
    Bucket: config.s3._bucket,
    Key: path
  }).promise()

  const { ContentType, Body } = obj

  return {
    contentType: ContentType,
    data: Body
  }
}

/**
 * Put an object to s3
 * 
 * @param {String} path 
 * @param {S3Object} obj 
 */
const put = async (path, obj) => {
  const { data, contentType = '', acl = 'authenticated-read' } = obj

  const response = await s3.putObject({
    Bucket: config.s3._bucket,
    Key: path,
    Body: data,
    ContentType: contentType,
    ACL: acl
  }).promise()

  return response
}

const remove = async (key) => {

  const params = {
      Bucket : config.s3._bucket,
      Key : key
    }
  
  const response = await s3.deleteObject(params).promise();

  return response;
}

module.exports = {
  get,
  put,
  remove
}