export default {
  _bucket: process.env.AWS_S3_BUCKET,
  apiVersion: process.env.AWS_S3_API_VERSION,
  accessKeyId: process.env.AWS_S3_KEY_ID,
  secretAccessKey: process.env.AWS_S3_ACCESS_KEY,
  region: process.env.AWS_S3_REGION,
  signatureVersion: 'v4',
}