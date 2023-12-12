const { expect, test, describe, beforeEach } = require("@jest/globals");

const { VirtualDocksController } = require("../../controllers");
const { VirtualDocksService } = require("../../services");

const mockStoreModel = {
  findById: jest.fn(),
  findOne: jest.fn(),
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
jest.mock("myp-admin/database/mongo/models", () => ({
  StoreSchema: {
    Model: jest.fn(() => mockStoreModel),
  },
}));

describe("VirtualDocksController", () => {
  let virtualDocks;

  beforeEach(() => {
    virtualDocks = new VirtualDocksController();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getNotification", () => {
    const error = {
      error: true,
      message: expect.anything(),
    };

    const data = {
      items: expect.anything(),
    };

    test("should return the quantity of failed products", async () => {
      jest
        .spyOn(VirtualDocksService.prototype, "getNotification")
        .mockImplementation(() => data);

      const req = { tenant: expect.anything() };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await virtualDocks.getNotification(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(
        VirtualDocksService.prototype.getNotification
      ).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(data);
    });

    test("should return status 404 when an error occurs", async () => {
      jest
        .spyOn(VirtualDocksService.prototype, "getNotification")
        .mockImplementation(() => error);

      const req = { tenant: expect.anything() };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await virtualDocks.getNotification(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(
        VirtualDocksService.prototype.getNotification
      ).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(error);
    });
  });

  describe("getStatus", () => {
    const validStoreData = {
      success: true,
      data: expect.anything(),
    };

    const invalidStoreData = {
      error: true,
      message: expect.anything(),
    };

    const store = {
      settings: {
        config_cnpj: expect.anything(),
      },
    };

    test("should return data when validStore call is successful", async () => {
      jest
        .spyOn(VirtualDocksService.prototype, "validStore")
        .mockImplementation(() => validStoreData);
      jest
        .spyOn(VirtualDocksService.prototype, "getStore")
        .mockImplementation(() => store);

      const req = { tenant: expect.anything() };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await virtualDocks.getStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(VirtualDocksService.prototype.validStore).toHaveBeenCalledTimes(1);
      expect(VirtualDocksService.prototype.getStore).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(validStoreData);
    });

    test("should return status 404 when store not found", async () => {
      jest
        .spyOn(VirtualDocksService.prototype, "validStore")
        .mockImplementation(() => validStoreData);
      jest
        .spyOn(VirtualDocksService.prototype, "getStore")
        .mockImplementation(() => invalidStoreData);

      const req = { tenant: expect.anything() };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await virtualDocks.getStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(VirtualDocksService.prototype.getStore).toHaveBeenCalledTimes(1);
      expect(VirtualDocksService.prototype.validStore).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(invalidStoreData);
    });

    test("should return status 404 when store is not valid", async () => {
      jest
        .spyOn(VirtualDocksService.prototype, "validStore")
        .mockImplementation(() => invalidStoreData);
      jest
        .spyOn(VirtualDocksService.prototype, "getStore")
        .mockImplementation(() => store);

      const req = { tenant: expect.anything() };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await virtualDocks.getStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(VirtualDocksService.prototype.getStore).toHaveBeenCalledTimes(1);
      expect(VirtualDocksService.prototype.validStore).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(invalidStoreData);
    });
  });
});
