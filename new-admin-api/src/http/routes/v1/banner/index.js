// Router
const router = require("express").Router();
const { objectIdValidation } = require("../../../middlewares");
//s3
const BannerController = require("./controllers/BannerController");

const bannerController = new BannerController();

router.get("/:id?", objectIdValidation, bannerController.paginate);

/**
 * Store a new entity
 */
router.post("/", bannerController.create);

/**
 * Update an existing entity
 */
router.put("/:id", objectIdValidation, bannerController.update);

/**
 * Delete an existing entity
 */
router.delete("/:id", objectIdValidation,bannerController.delete);

module.exports = router;
