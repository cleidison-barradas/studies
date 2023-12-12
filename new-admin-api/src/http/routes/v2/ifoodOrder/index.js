const router = require("express").Router();
const iFoodService = require("myp-admin/services/ifood");
const { paginationParser } = require("myp-admin/helpers");
const moment = require('moment')
const {
    Mongo: {
      getModelByTenant,
      Models: { StoreSchema },
    },
} = require("myp-admin/database");

router.get("/:id?", async (req, res) => {
    const { id } = req.params;
    const {
        page = 1,
        limit = 20,
        search = '',
        status = '',
        start = null,
        end = null
    } = req.query

    try {
        const Store = StoreSchema.Model();
        const iFoodOrder = getModelByTenant(req.tenant, 'IFoodOrderSchema');
        const store = await Store.findOne({ tenant: req.tenant });
        const {
            settings: { config_ifood_client_id, config_ifood_client_secret },
        } = store;

        if (!config_ifood_client_id) {
            return res.json({ message: "Loja nao cadastrada" });
        }

        const ifoodService = new iFoodService(
            config_ifood_client_id,
            config_ifood_client_secret
        );

        if (id) {
            const order = await ifoodService.queryEvent(id);
            return res.json({ ifoodOrder: order });
        }

        let filter = {}
        if(search.trim().length > 0) {
            filter = {
                ...filter,
                '$or': [
                    { ifoodCode: new RegExp(search, 'gi') },
                    { partnerCode: new RegExp(search, 'gi') }
                ]
            }
        }

        if(status) {
            filter = {
                ...filter,
                status: status
            }
        }
        if(start && end) {
            filter = {
                ...filter,
                createdAt: {
                    $gte: moment(start).utc().startOf('day').toDate(),
                    $lte: moment(end).utc().endOf('day').toDate()
                }
            }
        }
        const paginationOptions = {
            page,
            limit,
            sort: "-createdAt",
        };

        console.log(filter)
        const pagination = await iFoodOrder.paginate(filter, paginationOptions);
        return res.json(paginationParser('ifoodHistory', pagination));
    } catch (error) {
        return res.json({ error: error.message });
    }
});
  
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const Store = StoreSchema.Model();
        const store = await Store.findOne({ tenant: req.tenant });

        const {
        settings: { config_ifood_client_id, config_ifood_client_secret },
        } = store;

        if (!config_ifood_client_id) {
        return res.json({ message: "Loja nao cadastrada" });
        }
        const ifoodService = new iFoodService(
        config_ifood_client_id,
        config_ifood_client_secret
        );

        await ifoodService.validateEvent(id);
        return res.json({ message: "Evento validado" });
    } catch (error) {
        return res.json({ error: error.message });
    }
});

module.exports = router