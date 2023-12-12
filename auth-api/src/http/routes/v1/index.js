// Routing version
const name = 'v1';

// Routes for this version
const routes = {
 '/users': require('./User'),
 '/stores': require('./Store'),
 '/sessions': require('./Session'),
 '/refreshToken': require('./RefreshToken'),
 '/userTenants': require('./UserTenants'),
 '/userSetTenants': require('./UserSetTenant'),
 '/forgotPassword': require('./ForgotPassword'),
 '/resetPassword': require('./ResetPassword'),
 '/customer': require('./CustomerSession'),
 '/store': require('./StoreSession')
}
module.exports = {
  name,
  routes,
};
