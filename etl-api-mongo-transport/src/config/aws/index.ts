import * as aws from'aws-sdk'

const {
  AWS_S3_BUCKET,
  AWS_S3_API_VERSION,
  AWS_S3_KEY_ID,
  AWS_S3_ACCESS_KEY,
  AWS_S3_REGION,
} = process.env

type S3Config = aws.S3.ClientConfiguration & {
  _bucket: string
}

export const s3Config: S3Config = {
  _bucket: AWS_S3_BUCKET,
  apiVersion: AWS_S3_API_VERSION || '2006-03-01',
  accessKeyId: AWS_S3_KEY_ID,
  secretAccessKey: AWS_S3_ACCESS_KEY,
  region: AWS_S3_REGION,
}