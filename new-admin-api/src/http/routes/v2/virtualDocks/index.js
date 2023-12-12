const { VirtualDocksController } = require("./controllers");

const router = require("express").Router();

const virtualDocksController = new VirtualDocksController();

router.get("/status", virtualDocksController.getStatus);
router.get('/notification', virtualDocksController.getNotification)

module.exports = router;
