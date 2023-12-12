export default interface Details {
  payment_type?: string,
  payment_method?: string,
  payment_installments?: number,
  payment_maxInstallments?: number,
  payment_quota?: number,
  payment_additional_info?: string,
  payment_interest?: number,
  external ?: boolean
  id ?: string
}
