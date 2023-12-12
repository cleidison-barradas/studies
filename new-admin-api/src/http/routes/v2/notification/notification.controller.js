const router = require("express").Router();
const handlebarsTemplate = require("myp-admin/services/handlebarsConfig");
const path = require("path");
const { paginationParser, updateFieldsParser } = require("myp-admin/helpers")

const { main_queue, dead_queue } = require('../../../../plugins/queues')

const {
  Mongo: {
    getModelByTenant,
    Models: { StoreSchema, NotificationSchema },
  },
} = require("myp-admin/database")

router.get('/:id?', async (req, res) => {
  try {
    const Store = StoreSchema.Model();
    const Notifications = getModelByTenant(req.tenant, "NotificationSchema")
    const store = await Store.findById(req.store);
    const filters = {};
    const { id } = req.params

    const {
        page = 1,
        limit = 20,
        type = null,
    } = req.query;


  if (id) {
        let notification = await Notifications.findById(id);

        if (!notification) {
            return res.status(404).json({
                error: "notification_not_found",
            });
        }

        return res.json({
            notification,
        });
    }

    const paginationOptions = {
        page,
        limit,
        sort: { name: 1 },
        forceCountFn: true,
    };


    if (type && type.length > 0) {
        filters["type"] = new RegExp(type, "i")
    }

    const pagination = await Notifications.paginate(filters, paginationOptions);
    return res.json(paginationParser("notification", pagination));

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});



module.exports = router
