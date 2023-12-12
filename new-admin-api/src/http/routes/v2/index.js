// Routing version
const name = "v2";

// Routes for this version
const routes = {
  "/products": require("./products"),
  "/ifood": require("./ifoodOrder"),
  "/virtualDocks": require('./virtualDocks'),
  "/paymentLinks": require("./paymentLinks/paymentLinks.controller"),
  "/pwaInstallations": require("./pwaInstallations/pwaInstallations.controller"),
  "/paymentMethod": require("./paymentMethod/PaymentMethod.controller"),
  "/storeBranchPickup": require("./storeBranchPickup/storeBranchPickup.controller"),
  "/notification": require("./notification/notification.controller")
};
module.exports = {
  name,
  routes,
};
