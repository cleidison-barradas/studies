export default interface GAnalytics {
    _id?: string
    type: string
    project_id: string
    private_key_id: string
    private_key: string
    client_email: string
    client_id: string
    auth_uri: string
    token_uri: string
    auth_provider_x509_cert_url: string
    gaview: string
    deleted?: boolean
    createdAt?: Date
    updatedAt?: Date
    __v?: number
}
