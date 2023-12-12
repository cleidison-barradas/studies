const { getModelByTenant } = require("myp-admin/database/mongo");
const { updateFieldsParser } = require("myp-admin/helpers");
const { remove } = require("myp-admin/services/aws");
const { paginationParser } = require("myp-admin/helpers");

module.exports = class BannerController {
  async paginate(req, res) {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const Banner = getModelByTenant(req.tenant, "BannerSchema");

    // Detail Banner
    if (id) {
      const banner = await Banner.findById(id);

      if (!banner) {
        return res.status(404).json({
          error: "Banner_not_found",
        });
      }

      return res.json({
        banner,
      });
    } else {
      // Pagination options
      const paginationOptions = {
        page,
        limit,
      };

      // Make pagination
      const pagination = await Banner.paginate({}, paginationOptions);

      return res.json(paginationParser("banners", pagination));
    }
  }

  async update(req, res) {
    const { id } = req.params;
    const { description, image } = req.body;

    const Banner = getModelByTenant(req.tenant, "BannerSchema");

    let banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({
        error: "Banner_not_found",
      });
    }

    if (banner.image)
      await Promise.all(
        banner.image.map(async (value) => await remove(value.path))
      );

    // Mount update fields object
    const updateFields = updateFieldsParser({
      description,
      image,
    });

    // Update data
    await banner.updateOne({
      ...updateFields,
      updatedAt: Date.now(),
    });

    // Get updated data
    banner = await Banner.findById(id);

    return res.json({
      banner,
    });
  }

  async create(req, res) {
    const { description, image } = req.body;

    const Banner = getModelByTenant(req.tenant, "BannerSchema");

    const banner = await Banner.create({
      description,
      image,
    });

    res.json({
      banner,
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    const Banner = getModelByTenant(req.tenant, "BannerSchema");

    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({
        error: "Banner_not_found",
      });
    }

    // Make deletion
    await banner.delete();

    if (banner.image) {
      let images = banner.image;
      images.map(async (value) => await remove(value.path));
    }

    return res.json({
      deletedId: id,
    });
  }
};
