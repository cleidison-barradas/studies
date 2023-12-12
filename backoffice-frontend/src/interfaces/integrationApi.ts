export interface IntegrationData {
    trierData: {
        token: string,
        baseUrl: string
    }
}

export interface IntegrationApiBody {
    _id: string,
    integrationData: IntegrationData
}