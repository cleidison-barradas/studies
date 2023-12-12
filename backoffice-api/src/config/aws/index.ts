const { AWS_S3_BUCKET, AWS_S3_KEY_ID, AWS_S3_ACCESS_KEY, AWS_S3_REGION } = process.env

const awsConfig = {
  s3: {
    _bucket: AWS_S3_BUCKET,
    accessKeyId: AWS_S3_KEY_ID,
    secretAccessKey: AWS_S3_ACCESS_KEY,
    region: AWS_S3_REGION,
  },
}

export default awsConfig
