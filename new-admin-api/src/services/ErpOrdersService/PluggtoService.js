const { PLUGGTO_URL } = process.env
const  axios  = require("axios")
const https = require('https')
const {
    Mongo: {
      getModelByTenant,
      Models: { IntegrationMethodsSchema },
    },
  } = require("myp-admin/database")

class Pluggto {
    tenant
    integrationMethod
    authenticationData
    externalId
    external_shipping_id

    constructor(){
        console.log("Starting pluggto class")
    }

    async setup(tenant, externalId, external_shipping_id){
        const IntegrationMethods = getModelByTenant(tenant, "IntegrationMethodsSchema")
        this.tenant = tenant
        this.externalId = externalId
        this.external_shipping_id = external_shipping_id
        this.integrationMethod = await IntegrationMethods.findOne({"integrationOption.type" : "PLUGGTO"})
        this.api = axios.create({
            baseURL: PLUGGTO_URL,
            httpsAgent: new https.Agent({keepAlive: true}),
        })
    }

    async authentication(){ 
        const data = new URLSearchParams()
        data.set('client_id', `${this.integrationMethod?.integrationData.client_id}`)
        data.set('client_secret', `${this.integrationMethod?.integrationData.client_secret}`)
        data.set('username', `${this.integrationMethod?.integrationData.username}`)
        data.set('password', `${this.integrationMethod?.integrationData.password}`)
        data.set('grant_type', 'password')

        try{
            const res = await this.api.post('/oauth/token', data.toString() , {
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            })
            this.authenticationData = res.data
            console.log(`${this.tenant} logged succefully in Pluggto`)
        } catch(e){
            console.error(e.response.data.details)
            throw(e)
        }
    }

    async sendDeliveryMadeStatus(){
        try {
            const data = {
                status: "delivered"
            }
            await this.api.put(`/orders/${this.externalId}`, data, {
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.authenticationData.access_token}`
                }
            })
        } catch (error) {
            console.error(error)
            throw new Error(error)
        }
    }

    async putNfeData(nfe_data){

        try {
            const today = new Date()
            const date = `${today.getFullYear()}-${today.getMonth()}-${today.getDay()}`
            const data = {
                status: "invoiced",
                shipments: [{
                    id: String(this.external_shipping_id),
                    status: "invoiced",
                    date_shipped: date,
                    nfe_key: nfe_data.nfe_key,
                    nfe_link: nfe_data.nfe_link,
                    nfe_number: nfe_data.nfe_number,
                    nfe_serie: nfe_data.nfe_serie,
                    nfe_date: date
                }]
            }
            console.log(data)
            console.log(this.externalId)
            await this.api.put(`/orders/${this.externalId}`, data, {
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.authenticationData.access_token}`
                }
            })
            //return res
        } catch (error) {
            console.error(error)
            throw new Error(error)
        }
    }

    async putShippingData(shipping_data){

        try {
            const today = new Date()
            const date = `${today.getFullYear()}-${today.getMonth()}-${today.getDay()}`
            const data = {
                status: "shipping_informed",
                shipments: [{
                    id: this.external_shipping_id,
                    status: "shipped",
                    date_shipped: date,
                    shipping_company: shipping_data.shippingCompany, 
                    shipping_method: shipping_data.shippingMethod, 
                    track_code: shipping_data.trackCode,
                    track_url: shipping_data.trackUrl
                }]
            }
            console.log(data)
            console.log(this.externalId)
            await this.api.put(`/orders/${this.externalId}`, data, {
                headers: {
                    Authorization: `Bearer ${this.authenticationData.access_token}`
                }
            })
            //return res
        } catch (error) {
            console.error(error)
            throw new Error(error)
        }
    }
}

module.exports = { Pluggto }