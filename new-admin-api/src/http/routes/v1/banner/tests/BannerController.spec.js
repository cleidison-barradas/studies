const BannerController = require("../controllers/BannerController");

const mockStoreModel = {
  findById: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
  paginate: jest.fn(),
};

jest.mock("mongoose");
jest.mock("myp-admin/services/aws");
jest.mock("myp-admin/database/mongo", () => ({
  getModelByTenant: jest.fn(() => mockStoreModel),
}));

describe("BannerController", () => {
  let bannerController;
  let req;
  let res;

  const payload = {
    description: expect.any(String),
    image: [],
  };
  const banner = {
    _id: expect.any(String),
    image: [],
    url: expect.any(String),
    updatedAt: expect.any(Date),
    createdAt: expect.any(Date),
    description: expect.any(String),
  };

  beforeAll(() => {
    bannerController = new BannerController();
  });

  beforeEach(() => {
    req = {
      tenant: "store",
      body: {},
      query: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("must create a default banner and return it", async () => {
      req.body = payload;
      mockStoreModel.create.mockResolvedValueOnce(banner);

      await bannerController.create(req, res);

      expect(mockStoreModel.create).toHaveBeenCalledWith(payload);
      expect(res.json).toHaveBeenCalledWith({
        banner,
      });
    });

    it("must create banner with text information and return it", async () => {});
  });

  describe("update", () => {
    beforeEach(() => {
      jest.mock("myp-admin/helpers", () => ({
        updateFieldsParser: jest.fn(() => ({
          description: expect.any(String),
          image: [],
        })),
      }));
      req.params = { id: expect.any(String) };
      req.body = payload;
    });

    it("must update banner and return it", async () => {
      mockStoreModel.findById
        .mockImplementationOnce(() => ({
          ...banner,
          updateOne: jest.fn(),
        }))
        .mockImplementation(() => banner);

      await bannerController.update(req, res);

      expect(res.json).toHaveBeenCalledWith({
        banner,
      });
    });

    it("should return error if banner not found", async () => {
      mockStoreModel.findById.mockResolvedValueOnce(null);

      await bannerController.update(req, res);

      expect(res.json).toHaveBeenCalledWith({
        error: "Banner_not_found",
      });
    });
  });

  describe("paginate", () => {
    beforeEach(() => {
      req.params = {};
    });

    it("should return details of a banner when id is passed", async () => {
      req.params = { id: expect.any(String) };
      mockStoreModel.findById.mockResolvedValueOnce(banner);

      await bannerController.paginate(req, res);

      expect(res.json).toHaveBeenCalledWith({ banner });
    });

    it("should return error when id is passed and banner is not found", async () => {
      req.params = { id: expect.any(String) };
      mockStoreModel.findById.mockResolvedValueOnce(null);

      await bannerController.paginate(req, res);

      expect(res.json).toHaveBeenCalledWith({ error: "Banner_not_found" });
    });

    it("must paginate store banners when id not passed", async () => {
      mockStoreModel.paginate.mockResolvedValueOnce({
        docs: [{}],
        totalDocs: expect.any(Number),
        limit: expect.any(Number),
        totalPages: expect.any(Number),
        page: expect.any(Number),
        prevPage: expect.any(Number),
        nextPage: expect.any(Number),
      });

      await bannerController.paginate(req, res);

      expect(res.json).toHaveBeenCalledWith({
        banners: [{}],
        total: expect.any(Number),
        limit: expect.any(Number),
        pages: expect.any(Number),
        currentPage: expect.any(Number),
        prevPage: expect.any(Number),
        nextPage: expect.any(Number),
      });
    });
  });

  describe("delete", () => {
    beforeEach(() => {
      req.params = { id: expect.any(String) };
    });

    it("must delete banner and return its id", async () => {
      mockStoreModel.findById.mockResolvedValueOnce({
        ...banner,
        delete: jest.fn(),
      });

      await bannerController.delete(req, res);

      expect(res.json).toHaveBeenCalledWith({
        deletedId: req.params.id,
      });
    });

    it("should return error if banner not found", async () => {
      mockStoreModel.findById.mockResolvedValueOnce(null);

      await bannerController.delete(req, res);

      expect(res.json).toHaveBeenCalledWith({
        error: "Banner_not_found",
      });
    });
  });
});
