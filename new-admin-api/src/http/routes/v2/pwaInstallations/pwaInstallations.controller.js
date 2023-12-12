const router = require("express").Router();
const handlebarsTemplate = require("myp-admin/services/handlebarsConfig");
const path = require("path");

const { main_queue, dead_queue } = require('../../../../plugins/queues')




const {
  Mongo: {
    getModelByTenant,
    Models: { StoreSchema, StatusOrderSchema, PwaInstallationSchema },
  },
} = require("myp-admin/database")

router.get('/getInstallations', async (req, res) => {
  try {
    const Installations = await getModelByTenant(req.tenant, "PwaInstallationSchema");

    const installations = await Installations.find()
    return res.json(installations);

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router
