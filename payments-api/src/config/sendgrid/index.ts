export default {
  sendGridKey: process.env.SENDGRID_KEY || '',
  sendGridUser: process.env.SENDGRID_USER || '',
  sendGridOrderStoreTemplateId: process.env.SENDGRID_NEW_ORDER_STORE_TEMPLATE_ID,
  sendGridOrderCustomerTemplateId: process.env.SENDGRID_NEW_ORDER_CUSTOMER_TEMPLATE_ID
}