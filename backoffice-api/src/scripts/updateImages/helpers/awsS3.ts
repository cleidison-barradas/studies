import * as AWS from 'aws-sdk'
import awsConfig from '../../../config/aws'

import { imgToBuffer } from '../utils/imgToBuffer'

const s3 = new AWS.S3(awsConfig.s3)

async function uploadImageToS3(filePath: string, fileName: string): Promise<AWS.S3.ManagedUpload.SendData> {
  const imgBuffer = await imgToBuffer(`${filePath}`)

  const data = await s3.upload({
    Bucket: awsConfig.s3._bucket,
    Key: `products2/${fileName}`,
    Body: imgBuffer,
    ContentType: '.png',
    ACL: 'public-read',
  }).promise()

  return data
}

export { uploadImageToS3 }
