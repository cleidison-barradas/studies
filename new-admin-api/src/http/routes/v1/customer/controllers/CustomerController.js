const { getModelByTenant } = require("myp-admin/database/mongo");

module.exports = class CustomerController {
  async createWithEmail(req, res) {
    try {
      const Customer = getModelByTenant(req.tenant, "CustomerSchema");
      let { email } = req.body;

      const customer = await Customer.create({
        firstname: "",
        lastname: "",
        email,
        phone: "",
        cpf: "",
        password: "",
        passwordSalt: 10,
        status: true,
      });

      return res.json({ customer });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "internal_server_error",
      });
    }
  }
};
