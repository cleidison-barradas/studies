const axios = require('axios')
const { AWS_S3_URL } = process.env

module.exports = async function getCertificateFromS3(key) {
    return axios({
        url: `${AWS_S3_URL}${key}`,
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
