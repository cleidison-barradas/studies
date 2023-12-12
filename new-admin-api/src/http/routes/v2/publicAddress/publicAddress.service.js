const {
  Mongo: { getModelByTenant },
} = require("myp-admin/database");
const { paginationParser } = require("myp-admin/helpers");

class PublicAddressService {
  constructor(_tenant, _storeId) {
    this.storeId = _storeId;
    this.tenant = _tenant;
  }

  async createPublicAddress(publicAddressForm) {
    const { street, number, complement, neighborhood, postcode } = req.body;
    const PublicAddress = getModelByTenant(req.tenant, "PublicAddressSchema");
    const Neighborhood = getModelByTenant(req.tenant, "NeighborhoodSchema");

    return await StoreBranches.create(storeBranchPickup);
  }
}
module.exports = PublicAddressService;
