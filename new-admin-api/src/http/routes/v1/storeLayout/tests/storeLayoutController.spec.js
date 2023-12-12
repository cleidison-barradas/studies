const StoreLayoutController = require("../controllers/storeLayoutController");

const mockBannerModel = {
  create: jest.fn(),
  find: jest.fn(() => ({
    select: jest.fn(() => []),
  })),
  updateOne: jest.fn(),
  deleteMany: jest.fn(),
};

const mockStoreModel = {
  findById: jest.fn(),
};

jest.mock("mongoose");
jest.mock("myp-admin/services/aws");
jest.mock("myp-admin/utils/fileHelper", () => {});
jest.mock("myp-admin/database/mongo", () => ({
  getModelByTenant: jest.fn(() => mockBannerModel),
}));
jest.mock("myp-admin/database/mongo/models", () => ({
  StoreSchema: {
    Model: jest.fn(() => mockStoreModel),
  },
}));

describe("storeLayoutController", () => {
  let storeLayoutController;
  let req = {
    tenant: "store",
    body: {},
    query: {},
    params: {},
  };
  let res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeAll(() => {
    storeLayoutController = new StoreLayoutController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("banners with text information", () => {
    const banner = {
      title: expect.any(String),
      description: expect.any(String),
      locationAction: false,
      landlineAction: false,
      image: {
        url: expect.any(String),
      },
      whatsappAction: false,
    };

    req.body = {
      banners: [banner],
    };

    req.params = { id: expect.any(String) };

    it("must create banners with text information", async () => {
      await storeLayoutController.updateBannerWithText(req, res);

      expect(mockBannerModel.create).toHaveBeenCalledWith({
        ...banner,
        url: expect.any(String),
      });
    });

    it("should update banners with text information", async () => {
      const _id = expect.any(String);
      const payload = { ...banner, _id };

      req.body = {
        banners: [payload],
      };

      await storeLayoutController.updateBannerWithText(req, res);

      expect(mockBannerModel.updateOne).toHaveBeenCalledWith(
        { _id },
        { ...banner, url: expect.any(String) },
        { new: true }
      );
    });
  });
});
