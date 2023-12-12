const { Agent } = require('https')
const axios = require('axios')
const getCertificateFromS3 = require('../getFileFromS3')

const { GERENCIANET_PIX_URL } = process.env

const api = axios.create({
    baseURL: GERENCIANET_PIX_URL,
})

module.exports = {
    GetAgent: async (CertificateKey) => {
        const pfx = await getCertificateFromS3(CertificateKey)

        const httpsAgent = new Agent({
            pfx,
            passphrase: '',
        })

        return httpsAgent
    },

    OAuth: async (payload) => {
        const { credentials, httpsAgent } = payload
        const { client_id, client_secret } = credentials

        const Authorization = `Basic ${Buffer.from(
            `${client_id}:${client_secret}`
        ).toString('base64')}`

        const headers = {
            Authorization,
            'Content-Type': 'application/json',
        }

        const data = JSON.stringify({ grant_type: 'client_credentials' })

        return api.post('/oauth/token', data, { headers, httpsAgent })
    },

    CreatePixBilling: async (payload) => {
        const { data, access_token, httpsAgent } = payload

        const headers = {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        }

        return api.post(`/v2/cob`, data, { headers, httpsAgent })
    },

    GetPixQRCode: async (payload) => {
        const { loc_id, httpsAgent, access_token } = payload

        const headers = {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        }

        return api.get(`/v2/loc/${loc_id}/qrcode`, { headers, httpsAgent })
    },

    RegisterCallback: async (payload) => {
        const { webhookUrl, chave, httpsAgent, access_token } = payload
        console.log('payload: ', payload)
        const headers = {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        }

        return api.put(
            `/v2/webhook/${chave}`,
            { webhookUrl },
            { headers, httpsAgent }
        )
    },
}
