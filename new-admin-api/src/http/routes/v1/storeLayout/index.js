const router = require("express").Router();
const { affiliateCheck } = require("myp-admin/http/middlewares/affiliate.middleware");
const { Mongo } = require("../../../../database");

const {
  Models: { StoreSchema },
  getModelByTenant,
} = Mongo;

const { objectIdValidation } = require("../../../middlewares");
const StoreLayoutController = require("./controllers/storeLayoutController");

const storeLayoutController = new StoreLayoutController();

router.get("/:id?", objectIdValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const Banner = getModelByTenant(req.tenant, "BannerSchema");
    const banners = await Banner.find({});

    const Store = StoreSchema.Model();

    const store = await Store.findById(id);

    return res.json({
      banners,
      store,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
});

router.post("/:id", affiliateCheck('BANNERS', 'UPDATE'), storeLayoutController.configure);
router.put("/bannerWithText/:id", storeLayoutController.updateBannerWithText);

module.exports = router;
