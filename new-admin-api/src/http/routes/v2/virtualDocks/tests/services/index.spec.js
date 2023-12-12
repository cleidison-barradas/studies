const { expect, test, describe, beforeEach } = require("@jest/globals");
const { VirtualDocksService } = require("../../services");

const mockStoreModel = {
  findById: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
};

const mockAxios = {
  data: {},
  status: 200,
};

jest.mock("mongoose");
jest.mock("axios", () => ({
  create: jest.fn(() => ({
    get: jest.fn(() => mockAxios),
  })),
}));
jest.mock("myp-admin/services/aws");
jest.mock("myp-admin/utils/fileHelper", () => {});
jest.mock("myp-admin/database/mongo", () => ({
  findOne: jest.fn(),
}));
jest.mock("myp-admin/database/mongo", () => ({
  getModelByTenant: jest.fn(() => mockStoreModel),
}));
jest.mock("myp-admin/database/mongo/models", () => ({
  StoreSchema: {
    Model: jest.fn(() => mockStoreModel),
  },
}));

describe("VirtualDocksService", () => {
  let virtualDocks;

  beforeEach(() => {
    virtualDocks = new VirtualDocksService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getStore", () => {
    test("service should return a store when passing tenant", async () => {
      mockStoreModel.findOne = jest.fn(() => ({}));

      const store = await virtualDocks.getStore("any");

      expect(mockStoreModel.findOne).toHaveBeenCalledTimes(1);
      expect(store).toEqual({});
      expect(store).not.toBeNull();
    });

    test("should return error when not finding a store", async () => {
      mockStoreModel.findOne = jest.fn(() => {});

      const store = await virtualDocks.getStore("any");

      expect(store.error).toEqual(true);
      expect(store.message).toEqual("store not found");
    });
  });

  describe("getNotification", () => {
    test("should return error when not finding a store", async () => {
      mockStoreModel.find = jest.fn(() => {
        throw new Error("store_not_found");
      });

      const data = await virtualDocks.getNotification("any");

      expect(data.error).toEqual(true);
      expect(data.message).toEqual("store_not_found");
    });

    test("must return items with value 0 when there are no notifications", async () => {
      mockStoreModel.find = jest.fn(() => []);

      const data = await virtualDocks.getNotification("any");

      expect(data.items).toBe(0);
    });

    test("sould return items with the full quantity of products", async () => {
      const payload = [{ products: [expect.anything(), expect.anything()] }];
      mockStoreModel.find = jest.fn(() => payload);

      const data = await virtualDocks.getNotification("any");

      expect(data.items).toBe(payload[0].products.length);
    });
  });

  describe("validStore", () => {
    test("should return data when store is valid", async () => {
      const payload = jest.fn({});

      mockAxios.data = payload;

      const data = await virtualDocks.validStore("any");

      expect(data).toEqual(payload);
    });

    test("should return an error message when the API call fails", async () => {
      const payload = {
        error: true,
        message: "virtual docks is not available",
      };

      mockAxios.status = 403;

      const data = await virtualDocks.validStore("any");

      expect(data).toEqual(payload);
    });
  });
});
