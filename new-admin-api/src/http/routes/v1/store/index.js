const router = require('express').Router();
const {
  Mongo: {
    Models: { PMCSchema, PlanSchema, UserSchema, StoreSchema },
    getModelByTenant,
  },
} = require('myp-admin/database');
const { updateFieldsParser } = require('myp-admin/helpers');
const iFoodService = require('myp-admin/services/ifood');
const EpharmaService = require('myp-admin/services/ErpOrdersService/EpharmaService');
const { AWS_S3_URL } = process.env;
const { Segments, Joi, celebrate } = require('celebrate');
const {
  updateStoreLocation,
  getStoreLocationIfNeeded,
} = require('../../../../services/getGeocode');
const { encriptText } = require('myp-admin/utils');
const FarmaciasAppService = require('myp-admin/services/FarmaciasAppService/FarmaciasAppService');
const { mask } = require('validation-br/dist/cnpj');

router.get('/:storeId?', async (req, res) => {
  try {
    const Store = StoreSchema.Model();
    const { storeId } = req.params;
    const tenant = req.tenant;
    const links = {
      facebook_shopping: `${AWS_S3_URL}produtos_para_facebook/${tenant}/produtos_facebook_${tenant}.csv`,
      google_shopping: `${AWS_S3_URL}produtos_para_google/${tenant}/produtos_para_google_${tenant}.xml`,
      consulta_remedios: `${AWS_S3_URL}produtos_consulta_remedios/${tenant}/produtos_consultaremedios_${tenant}.csv`,
      cote_facil: `${AWS_S3_URL}produtos_cotefacil/${tenant}/produtos_cotefacil_${tenant}.csv`,
      cliquefarma: `${AWS_S3_URL}produtos_cliquefarma/${tenant}/produtos_cliquefarma_${tenant}.xml`,
      buscape: `${AWS_S3_URL}produtos_buscape/${tenant}/produtos_buscape_${tenant}.xml`,
    };
    if (storeId) {
      const store = await Store.findById(storeId);
      if (!store) {
        return res.status(404).json({ error: 'store_not_found' });
      }

      const geoLocation = getStoreLocationIfNeeded(store);

      if (geoLocation.latitude && geoLocation.longitude) {
        const fieldsToParse = {};
        fieldsToParse['config_address_latitude'] = geoLocation.latitude;
        fieldsToParse['config_address_longitude'] = geoLocation.longitude;

        const updateFields = updateFieldsParser(fieldsToParse);

        await store.updateOne({
          settings: { ...store.settings, ...updateFields },
          updatedAt: Date.now(),
        });
      }

      store.settings = { ...store.settings, ...links };

      return res.json({
        store,
      });
    }

    const store = await Store.findById(req.store);
    const geoLocation = await getStoreLocationIfNeeded(store);

    if (geoLocation) {
      const fieldsToParse = {};
      if (geoLocation.latitude && geoLocation.longitude) {
        fieldsToParse['config_address_latitude'] = geoLocation.latitude;
        fieldsToParse['config_address_longitude'] = geoLocation.longitude;
        const updateFields = updateFieldsParser(fieldsToParse);
      } else {
        fieldsToParse['config_address_latitude'] = 0;
        fieldsToParse['config_address_longitude'] = 0;
      }

      const updateFields = updateFieldsParser(fieldsToParse);
      await store.updateOne({
        settings: { ...store.settings, ...updateFields },
        updatedAt: Date.now(),
      });
    }

    store.settings = { ...store.settings, ...links };

    if (!store) {
      return res.status(404).json({ error: 'store_not_found' });
    }

    return res.json({
      store,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 'internal_server_error',
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    const model = StoreSchema.Model();
    const User = UserSchema.Model();
    let store = await model.findById(req.store);

    if (!store) {
      return res.json({
        error: 'store_not_found',
      });
    }

    const updateFields = updateFieldsParser({
      name,
    });

    await store.updateOne({
      ...updateFields,
      updatedAt: Date.now(),
    });

    store = await model.findById(req.store).populate('erp');
    await User.updateMany(
      { 'store._id': store._id },
      { $set: { 'store.[element]': store } },
      { arrayFilters: [{ 'element._id': store._id }], multi: true },
    );

    return res.json({ store });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.post('/settings', async (req, res) => {
  const Store = StoreSchema.Model();
  const User = UserSchema.Model();

  try {
    const {
      name,
      settings: {
        config_cnpj,
        config_phone,
        config_cpf_checkout,
        config_hide_prices,
        config_store_city,
        config_store_number,
        config_pharmacist_crf,
        config_pharmacist_name,
        config_responsible_name,
        config_logo,
        config_email,
        config_google_tag_manager_id,
        config_stock,
        config_show_celphone,
        config_navbar_color,
        config_meta_keyword,
        config_meta_description,
        config_meta_title,
        config_cep,
        config_hotjar_id,
        config_owner,
        config_address,
        config_schema_markup,
        config_navbar_text_color,
        config_whatsapp_button,
        config_withdraw,
        config_whatsapp_phone,
        config_tawk_embed,
        config_url,
        config_name,
        config_company_name,
        config_analytics_id,
        config_analytics_api_client_id,
        config_pixel_id,
        gaview,
        ga_client_email,
        ga_private_key,
        config_ifood_client_id,
        config_ifood_client_secret,
        config_ifood_store_id,
        config_shipping_courier,
        product_default_send_box = 1,
        config_default_product_weight,
        config_default_product_height,
        config_default_product_length,
        config_default_product_width,
        etlMergeableFields,
        config_best_shipping_client_id,
        config_best_shipping_client_secret,
        config_best_shipping,
        config_social_login,
        config_stock_display,
        config_afe,
        config_farmaciasapp_client_id,
        config_farmaciasapp_client_secret,
        config_farmaciasapp_seller_id,
        config_pickup_in_store,
        config_correios_free_from,
        config_best_shipping_free_from,
      },
    } = req.body;

    let store = await Store.findById(req.store);

    if (!store) {
      return res.status(404).json({
        error: 'store_not_found',
      });
    }

    const geoLocation = await updateStoreLocation(
      store,
      config_cep,
      config_address,
      config_store_number,
      config_store_city,
    );
    if (
      config_ifood_store_id &&
      config_ifood_client_secret &&
      config_ifood_client_id
    ) {
      const ifoodService = new iFoodService(
        config_ifood_client_id,
        config_ifood_client_secret,
      );
      await ifoodService.auth();
    }

    const fieldsToParse = {
      config_cnpj,
      config_phone,
      config_cpf_checkout,
      config_hide_prices,
      config_store_city,
      config_store_number,
      config_pharmacist_crf,
      config_pharmacist_name,
      config_responsible_name,
      config_logo,
      config_email,
      config_google_tag_manager_id,
      config_stock,
      config_show_celphone,
      config_navbar_color,
      config_meta_keyword,
      config_meta_description,
      config_meta_title,
      config_cep,
      config_hotjar_id,
      config_owner,
      config_address,
      config_schema_markup,
      config_navbar_text_color,
      config_whatsapp_button,
      config_withdraw,
      config_whatsapp_phone,
      config_tawk_embed,
      config_url,
      config_name,
      config_company_name,
      config_analytics_id,
      config_analytics_api_client_id,
      config_pixel_id,
      gaview,
      ga_client_email,
      ga_private_key,
      config_ifood_client_id,
      config_ifood_client_secret,
      config_ifood_store_id,
      config_shipping_courier,
      product_default_send_box,
      config_default_product_weight,
      config_default_product_height,
      config_default_product_length,
      config_default_product_width,
      etlMergeableFields,
      config_best_shipping_client_id,
      config_best_shipping_client_secret,
      config_best_shipping,
      config_social_login,
      config_stock_display,
      config_afe,
      config_farmaciasapp_seller_id,
      config_pickup_in_store,
      config_correios_free_from,
      config_best_shipping_free_from,
    };

    if (geoLocation.latitude && geoLocation.longitude) {
      fieldsToParse['config_address_latitude'] = geoLocation.latitude;
      fieldsToParse['config_address_longitude'] = geoLocation.longitude;
    }

    const updateFields = updateFieldsParser(fieldsToParse);

    if (
      store.settings.config_farmaciasapp_client_secret !==
      config_farmaciasapp_client_secret &&
      store.settings.config_farmaciasapp_client_id !==
      config_farmaciasapp_client_id
    ) {
      updateFields['config_farmaciasapp_client_secret'] = await encriptText(
        process.env.ENCRYPT_FAPP_SECRETS_KEY,
        config_farmaciasapp_client_secret,
      );
      updateFields['config_farmaciasapp_client_id'] = await encriptText(
        process.env.ENCRYPT_FAPP_SECRETS_KEY,
        config_farmaciasapp_client_id,
      );
      updateFields['config_farmaciasapp_integrationStatus'] = 'not_integrated';

      const farmaciasAppService = new FarmaciasAppService({
        config_farmaciasapp_client_secret,
        config_farmaciasapp_client_id,
        config_farmaciasapp_seller_id,
        cnpj: mask(store.settings.config_cnpj),
      });

      try {
        await farmaciasAppService.callFirstLoad();
      } catch (error) {
        console.log('ERRO FIRST LOAD');
        console.log(error);

        await store.updateOne({
          name: name ? name : store.name,
          settings: {
            ...store.settings,
            config_farmaciasapp_integrationStatus: 'error_first_load',
          },
          updatedAt: Date.now(),
        });

        return res.status(500).json({
          error: 'internal_server_error',
        });
      }
    }

    await store.updateOne({
      name: name ? name : store.name,
      settings: { ...store.settings, ...updateFields },
      updatedAt: Date.now(),
    });

    const newStore = await Store.findById(req.store);

    await User.updateMany(
      { 'store._id': newStore._id },
      { $set: { store: newStore, updatedAt: new Date() } },
    );

    return res.json({ store: newStore });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
    });
  }
});

router.put('/pmc', async (req, res) => {
  try {
    const Store = StoreSchema.Model();
    const PmcRegion = PMCSchema.Model();

    const { storeId, pmcRegionId } = req.body;

    const pmc = await PmcRegion.findById(pmcRegionId);

    if (!pmc) {
      return res.status(404).json({
        error: 'pmc_region_not_found',
      });
    }

    const store = await Store.findById(storeId);

    if (!store) {
      return res.status(404).json({
        error: 'store_not_found',
      });
    }

    await store.updateOne({
      pmc,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 'internal_server_error',
    });
  }
});

router.post('/plans', async (req, res) => {
  try {
    const Plan = PlanSchema.Model();
    const Store = StoreSchema.Model();
    const { storeId, planId } = req.body;

    const plan = await Plan.findById(planId);

    if (!plan) {
      return res.status(404).json({
        error: 'plan_not_found',
      });
    }

    let store = await Store.findById(storeId);

    if (!store) {
      return res.status(404).json({
        error: 'store_not_found',
      });
    }

    await store.updateOne({ plan });

    store = await Store.findById(storeId);

    return res.json({
      store,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 'internal_server_error',
    });
  }
});

router.post('/erp', async (req, res) => {
  try {
    const Store = StoreSchema.Model();
    const Erp = getModelByTenant('integration', 'IntegrationErpSchema');
    const { storeId, erpId } = req.body;

    const erp = await Erp.findById(erpId);

    if (!erp) {
      return res.status(404).json({
        error: 'erp_not_found',
      });
    }

    let store = await Store.findById(storeId);

    if (!store) {
      return res.status(404).json({
        error: 'store_not_found',
      });
    }

    await store.updateOne({ erp });

    store = await Store.findById(storeId);

    return res.json({
      store,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 'internal_server_error',
    });
  }
});
router.put(
  '/settings/epharma',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      config_epharma_clientId: Joi.string(),
      config_epharma_password: Joi.string(),
      config_epharma_username: Joi.string(),
    }),
  }),
  async (req, res) => {
    try {
      const Store = StoreSchema.Model();
      const {
        config_epharma_clientId,
        config_epharma_password,
        config_epharma_username,
      } = req.body;

      let store = await Store.findById(req.store);

      if (!store) {
        return res.status(404).json({
          error: 'store_not_found',
        });
      }

      store.settings = {
        ...store.settings,
        config_epharma_username,
        config_epharma_password,
        config_epharma_clientId,
      };

      const settings = store.settings;

      const epharmaService = new EpharmaService({ settings });

      await epharmaService.authenticate();

      store = await store.updateOne(store);

      return res.json({
        config_epharma_clientId,
        config_epharma_username,
        config_epharma_password,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: 'internal_server_error',
      });
    }
  },
);

module.exports = router;
