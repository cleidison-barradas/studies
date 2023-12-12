const { StoreSchema } = require("myp-admin/database/mongo/models");
const { getModelByTenant } = require("myp-admin/database/mongo");

const axios = require("../../../../../services/virtualDocks");

module.exports = {
  VirtualDocksService: class VirtualDocksService {
    async getStore(tenant) {
      try {
        const Store = StoreSchema.Model();

        const store = await Store.findOne({ tenant });

        if (!store) throw new Error("store not found");

        return store;
      } catch (error) {
        return { error: true, message: error.message };
      }
    }

    async getNotification(
      tenant,
      type = [
        "DOCAS_INTEGRATED_BUT_NOT_CUSTOMIZED_PRODUCT",
        "DOCAS_PRODUCT_NOT_INTEGRATED",
      ]
    ) {
      try {
        const Notifications = getModelByTenant(tenant, "NotificationSchema");

        const notifications = await Notifications.find({
          type: {
            $in: type,
          },
        });

        if (notifications.length == 0) return { items: 0 };

        const items = notifications.reduce(
          (acc, notification) => acc + notification.products.length,
          0
        );

        return { items };
      } catch (error) {
        return { error: true, message: error.message };
      }
    }

    async validStore(cnpj) {
      try {
        const { data, status } = await axios.get("/api/v1/sellers/" + cnpj);

        if (status == 200) return data;

        throw new Error();
      } catch (error) {
        return { error: true, message: "virtual docks is not available" };
      }
    }
  },
};
