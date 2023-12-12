import * as AWS from 'aws-sdk'
import awsConfig from '../../../config/aws'

import { imgToBuffer } from '../helpers/imgToBuffer'

const s3 = new AWS.S3(awsConfig.s3)

async function uploadImageToS3(filePath: string, fileName: string, folder: string): Promise<AWS.S3.ManagedUpload.SendData> {
  const Body = await imgToBuffer(`${filePath}`)

  const data = await s3.upload({
    Bucket: awsConfig.s3._bucket,
    Key: `${folder}/${fileName}`,
    Body,
    ContentType: '.png',
    ACL: 'public-read',
  }).promise()

  return data
}

export { uploadImageToS3 }
