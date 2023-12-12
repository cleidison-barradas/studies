const {
  Mongo: {
    Models: { StoreSchema },
  },
} = require("myp-admin/database");

module.exports = class DeliveryScheduleController {
  async addAverageDeliveryTime(req, res) {
    try {
      const Store = StoreSchema.Model();

      const { averageDeliveryTime } = req.body;

      const store = await Store.findById(req.store);

      if (!store)
        return res.status(404).json({
          error: "store_not_found",
        });

      const { settings } = store;

      const {
        settings: { config_delivery_schedule },
      } = await Store.findByIdAndUpdate(
        req.store,
        {
          settings: {
            ...settings,
            config_delivery_schedule: {
              ...(settings.config_delivery_schedule || {}),
              average_delivery_time: averageDeliveryTime,
            },
          },
        },
        { new: true }
      );

      return res.status(200).json({
        config_delivery_schedule,
      });
    } catch (error) {
      return res.status(401).json({ error: "internal_server_error" });
    }
  }

  async getAverageDeliveryTime(req, res) {
    try {
      const Store = StoreSchema.Model();

      const store = await Store.findById(req.store);

      if (!store)
        return res.status(404).json({
          error: "store_not_found",
        });

      const { settings } = store;

      const { config_delivery_schedule } = settings;

      return res.status(200).json({
        config_delivery_schedule,
      });
    } catch (error) {
      return res.status(401).json({ error: "internal_server_error" });
    }
  }
};
