const {
  Mongo: { getModelByTenant },
} = require("myp-admin/database");
const { paginationParser } = require("myp-admin/helpers");

class StoreBranchPickupService {
  constructor(_tenant, _storeId) {
    this.storeId = _storeId;
    this.tenant = _tenant;
  }

  async getStoreBranches(id, query) {
    const StoreBranches = getModelByTenant(
      this.tenant,
      "StoreBranchPickupSchema"
    );

    if (id) {
      const storeBranchPickup = await StoreBranches.findById(id);
      return { storeBranchPickup };
    }

    if (query) {
      const { page, limit } = query;
      const paginationOptions = {
        page: page || 1,
        limit: limit || 5,
        sort: { createdAt: 1 },
      };
      const filters = {};

      const pagination = await StoreBranches.paginate(
        filters,
        paginationOptions
      );

      return paginationParser("storeBranches", pagination);
    }

    return {
      message: "No store branch pickup found",
    };
  }

  async createStoreBranch(storeBranchPickupForm) {
    const StoreBranches = getModelByTenant(
      this.tenant,
      "StoreBranchPickupSchema"
    );
    const Address = getModelByTenant(this.tenant, "PublicAddressSchema");
    const storeBranchAddress = await Address.create(
      storeBranchPickupForm.address
    );

    const storeBranchPickup = {
      name: storeBranchPickupForm.name,
      address: storeBranchAddress,
    };

    return await StoreBranches.create(storeBranchPickup);
  }

  async deleteStoreBranch(id) {
    const StoreBranches = getModelByTenant(
      this.tenant,
      "StoreBranchPickupSchema"
    );
    const storeBranchPickup = await StoreBranches.findByIdAndDelete(id).exec();

    return { deletedId: storeBranchPickup._id };
  }
}

module.exports = StoreBranchPickupService;
