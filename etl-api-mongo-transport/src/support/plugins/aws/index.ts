import * as aws from 'aws-sdk'
import { s3Config } from '../../../config/aws'

class Storage {
  private s3: aws.S3

  public init() {
    this.s3 = new aws.S3(s3Config)
  }

  public async copy(src: string, dest: string) {
    try {
      // await this.s3.copyObject({
      //   Bucket: s3Config._bucket,
      //   CopySource: src,
      //   Key: dest
      // }).promise()

      const origin = await this.s3.getObject({
        Bucket: s3Config._bucket,
        Key: src
      }).promise()

      await this.s3.putObject({
        Bucket: s3Config._bucket,
        Key: dest,
        Body: origin.Body
      }).promise()

      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }
}

export const AWSS3 = new Storage()
