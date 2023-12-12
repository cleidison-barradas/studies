const crypto = require("crypto");
const { QueuePlugin } = require('@mypharma/api-core')
const fileHelper = require("myp-admin/utils/fileHelper");
const { StoreSchema } = require("myp-admin/database/mongo/models");
const { getModelByTenant } = require("myp-admin/database/mongo");

const { put, removeMany } = require("../../../../../services/aws");

module.exports = class StoreLayoutController {
  async configure(req, res) {
    try {
      const Store = StoreSchema.Model();
      const Banner = getModelByTenant(req.tenant, "BannerSchema");

      const { color, banners, logo, text, secondary, textHeader, textFooter } =
        req.body;
      const { id } = req.params;
      let response = {};
      const promises = []

      const store = await Store.findById(id);
      // if we have banners lets handle it
      if (banners) {
        const bannerResponse = [];
        //  ids that were sent will stay
        const ids = banners.map((value) => value._id);
        // delete all banners that were not sent
        const images = await Banner.find({
          _id: {
            $nin: ids,
          },
        }).select({ "image.key": 1, _id: 0 });

        const keys = images.map((value) => {
          return { Key: value.image.key };
        });

        await Banner.deleteMany({
          _id: {
            $nin: ids,
          },
        });

        if (keys && keys.length > 0) {
          await removeMany(keys);
        }

        for await (let banner of banners) {
          // if we have the content on the banner,then its new,if not then we should not do anything with it
          if (banner.image.content) {
            const name = `${crypto.randomBytes(20).toString("hex")}-${banner.image.name
              }`;
            const path = `${req.tenant}/banners/${name}`;

            banner.image.content = await fileHelper(
              banner.image.content,
              {},
              100
            );

            const response = await put(path, banner.image);
            bannerResponse.push({
              image: {
                name: name,
                folder: path,
                url: response.Location,
                key: response.Key,
              },
              url: banner.url,
            });
          }

          if (banner.url && banner._id) {
            await Banner.updateOne({ _id: banner._id }, { url: banner.url });
          }
        }

        await Banner.insertMany(bannerResponse);
        const finalBanners = await Banner.find({});
        response.banners = finalBanners;
      }

      if (!store) {
        return res.status(404).json({
          error: "store_not_found",
        });
      }

      const updateObj = {};

      // if the logo has content,then its new and should be updated.
      if (logo && logo.content) {
        logo.name = `${crypto.randomBytes(20).toString("hex")}-${logo.name}`;

        logo.content = await fileHelper(
          logo.content,
          store.settings.config_new_layout === true
            ? {}
            : { width: 250, height: 250 },
          100
        );

        const logoPath = `${id}/logo/${logo.name}`;
        const { key } = await put(logoPath, logo);
        updateObj.config_logo = key;
      }

      if (color) {
        updateObj.config_navbar_color = color;
      }

      if (secondary) {
        updateObj.config_secondary_color = secondary;
      }

      if (text) {
        updateObj.config_navbar_text_color = text;
      }

      if (textHeader) {
        updateObj.config_header_text_color = textHeader;
      }

      if (textFooter) {
        updateObj.config_footer_text_color = textFooter;
      }

      await store.updateOne({
        settings: {
          ...store.settings,
          ...updateObj,
        },
      });

      const newStore = await Store.findById(id);

      response.store = newStore;

      // check if store is a head store
      if (req.flagship_store && Array(req.tenants || []).length > 0) {
        console.log(req.tenants)

        req.tenants.forEach(tenant => {
          const affiliate = tenant
          const action = req.action
          const entity = req.entity
          const mainStore = req.tenant

          promises.push(QueuePlugin.publish('affiliate-store-change', { affiliate, mainStore, data: response.banners, action, entity }))
        })

        await Promise.all(promises)
      }

      return res.json(response);

    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.message });
    }
  }

  async updateBannerWithText(req, res) {
    try {
      const Banner = getModelByTenant(req.tenant, "BannerSchema");

      const { banners } = req.body;

      if (banners) {
        const updated = await Promise.all(
          await banners.map(
            async ({
              title,
              description,
              image: { url },
              landlineAction,
              locationAction,
              whatsappAction,
              ...banner
            }) => {
              if (banner._id) {
                await Banner.updateOne(
                  { _id: banner._id },
                  {
                    title,
                    description,
                    url,
                    landlineAction,
                    locationAction,
                    whatsappAction,
                    image: {
                      url,
                    },
                  },
                  { new: true }
                );

                return await Banner.findById(banner._id);
              } else {
                const banner = await Banner.create({
                  title,
                  description,
                  landlineAction,
                  whatsappAction,
                  locationAction,
                  url,
                  image: {
                    url,
                  },
                });

                return banner;
              }
            }
          )
        );
        return res.status(200).json(updated);
      } else {
        return res.status(404).json("missing_banners");
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: error.message });
    }
  }
};
