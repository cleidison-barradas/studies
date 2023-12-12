import Erp from "./erp"

export default interface IntegrationSql {
    _id: string,
    name: string,
    sql: string,
    description: string,
    erp: Erp,
    updatedAt?: Date,
    createdAt?: Date
}