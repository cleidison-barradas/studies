import * as AWS from 'aws-sdk'
import awsConfig from '../config/aws'
import { IUpload } from './interfaces/upload'

const s3 = new AWS.S3(awsConfig.s3)

export const get = async (path: string): Promise<unknown> => {
  const obj = await s3
    .getObject({
      Bucket: awsConfig.s3._bucket,
      Key: path,
    })
    .promise()

  const { ContentType, Body } = obj

  return {
    contentType: ContentType,
    data: Body,
  }
}

export const put = async (path: string, obj: IUpload): Promise<AWS.S3.ManagedUpload.SendData> => {
  const { content, type = '', acl = 'public-read' } = obj
  const response = await s3
    .upload({
      Bucket: awsConfig.s3._bucket,
      Key: path,
      Body: content,
      ContentType: type,
      ContentEncoding: 'base64',
      ACL: acl,
    })
    .promise()
  return response
}

export const remove = async (key: string): Promise<unknown> => {
  const params = {
    Bucket: awsConfig.s3._bucket,
    Key: key,
  }

  const response = await s3.deleteObject(params).promise()
  return response
}

export const removeMany = async (keys = []): Promise<unknown> => {
  const response = await s3
    .deleteObjects({
      Bucket: awsConfig.s3._bucket,
      Delete: { Objects: keys },
    })
    .promise()
  return response
}
