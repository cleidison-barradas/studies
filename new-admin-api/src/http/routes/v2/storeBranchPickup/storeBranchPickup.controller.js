const router = require("express").Router();
const StoreBranchPickupService = require("./storeBranchPickup.service");
const { objectIdValidation } = require("myp-admin/http/middlewares");

router.post("/", async (req, res) => {
  const { tenant, body } = req;

  const storeBranchPickupService = new StoreBranchPickupService(
    tenant,
    req.store
  );
  const storeBranchPickup = await storeBranchPickupService.createStoreBranch(
    body
  );

  return res.json({
    storeBranchPickup: storeBranchPickup,
  });
});

router.get("/:id?", objectIdValidation, async (req, res) => {
  const { tenant, query } = req;
  const { id } = req.params;
  const storeBranchPickupService = new StoreBranchPickupService(
    tenant,
    req.store
  );

  return res.json(await storeBranchPickupService.getStoreBranches(id, query));
});

router.delete("/:id?", objectIdValidation, async (req, res) => {
  const { tenant } = req;
  const { id } = req.params;

  const storeBranchPickupService = new StoreBranchPickupService(
    tenant,
    req.store
  );

  const deletedStoreBranch = await storeBranchPickupService.deleteStoreBranch(
    id
  );

  return res.json({
    deletedId: deletedStoreBranch._id,
  });
});

module.exports = router;
