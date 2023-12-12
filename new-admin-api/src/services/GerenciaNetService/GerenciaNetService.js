const {
    CreatePixBilling,
    GetAgent,
    GetPixQRCode,
    OAuth,
    RegisterCallback,
} = require('./requests')

module.exports = class GerenciaNet {
    certificateKey
    client_id
    client_secret
    pix_key

    access_token
    httpsAgent

    constructor(props) {
        const { certificateKey, client_id, client_secret, pix_key } = props
        this.certificateKey = certificateKey
        this.client_id = client_id
        this.client_secret = client_secret
        this.pix_key = pix_key
    }

    async Auth() {
        const { certificateKey, client_id, client_secret } = this

        try {
            const credentials = { client_id, client_secret }

            const httpsAgent = await GetAgent(certificateKey)
            this.httpsAgent = httpsAgent

            const { access_token } = await OAuth({
                credentials,
                httpsAgent,
            }).then((res) => res.data)

            this.access_token = access_token

            return access_token
        } catch (error) {
            throw error
        }
    }

    async GeneratePixBilling(payload) {
        try {
            await this.Auth()
            const { cpf, nome, valor, pedido_id } = payload
            const { pix_key, access_token, httpsAgent } = this

            const data = {
                calendario: {
                    expiracao: 3600,
                },
                devedor: {
                    cpf,
                    nome,
                },
                valor: {
                    original: valor,
                },
                chave: pix_key,
                infoAdicionais: [
                    {
                        nome: 'N* Pedido',
                        valor: `#${pedido_id}`,
                    },
                ],
            }

            return await CreatePixBilling({
                data: JSON.stringify(data),
                access_token,
                httpsAgent,
            }).then((res) => res.data)
        } catch (error) {
            throw error
        }
    }

    async GenerateQRCode(loc_id) {
        const { access_token, httpsAgent } = this
        return await GetPixQRCode({ access_token, httpsAgent, loc_id }).then(
            (res) => res.data
        )
    }

    async RegisterPixCallback(webhookUrl) {
        const { httpsAgent, access_token, pix_key } = this

        return await RegisterCallback({
            httpsAgent,
            access_token,
            chave: pix_key,
            webhookUrl,
        }).then((res) => res.data)
    }
}
