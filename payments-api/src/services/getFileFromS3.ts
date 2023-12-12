import axios from 'axios'

export default async function getCertificateFromS3(key: string) {
  const { AWS_S3_URL } = process.env

  return axios({
    url: new URL(key, AWS_S3_URL).href,
    method: 'GET',
    responseType: 'arraybuffer',
  })
    .then((res) => {
      return Buffer.from(res.data, 'utf-8')
    })
    .catch((err) => {
      throw err
    })
}
