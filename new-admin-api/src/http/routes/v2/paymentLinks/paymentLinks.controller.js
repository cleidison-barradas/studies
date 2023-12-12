const router = require("express").Router();
const PaymentLinksService = require("./paymentLinks.service");
const { objectIdValidation } = require("myp-admin/http/middlewares");

router.post("/", async (req, res) => {
  const {
    tenant,
    body: { products },
  } = req;

  if (!products || products.length === 0)
    return res.status(400).json({ message: "Cart is required" });

  const paymentLinksService = new PaymentLinksService(tenant, req.store);
  const paymentLink = await paymentLinksService.createPaymentLink(req.body);

  return res.json({
    link: paymentLink.link,
  });
});

router.get("/:id?", objectIdValidation, async (req, res) => {
  const { tenant, query } = req;
  const { id } = req.params;
  const paymentLinksService = new PaymentLinksService(tenant);

  return res.json(await paymentLinksService.getPaymentLinks(id, query));
});

router.delete("/:id?", objectIdValidation, async (req, res) => {
  const { tenant } = req;
  const { id } = req.params;
  const paymentLinksService = new PaymentLinksService(tenant);

  return res.json(await paymentLinksService.deletePaymentlink(id));
});

module.exports = router;
