const {
  SERVICE_TYPE
} = process.env

export const serviceConfig = {
  type: SERVICE_TYPE || 'mysql' as any
}
