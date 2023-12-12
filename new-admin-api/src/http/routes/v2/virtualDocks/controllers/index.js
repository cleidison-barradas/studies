const { VirtualDocksService } = require("../services/index");

module.exports = {
  VirtualDocksController: class VirtualDocksController {
    async getStatus(req, res) {
      try {
        const virtualDocksService = new VirtualDocksService();
        const store = await virtualDocksService.getStore(req.tenant);

        const data = await virtualDocksService.validStore(
          store.settings.config_cnpj
        );

        if (data.error) throw new Error(data.message);

        return res.status(200).json(data);
      } catch (error) {
        return res.status(404).json({ error: true, message: error.message });
      }
    }

    async getNotification(req, res) {
      try {
        const { tenant, body } = req;

        const virtualDocksService = new VirtualDocksService();

        const data = await virtualDocksService.getNotification(
          tenant,
          body?.type
        );

        return res.status(200).json(data);
      } catch (error) {
        console.log(error);
        return res.status(404).json({ error: true, message: error.message });
      }
    }
  },
};
