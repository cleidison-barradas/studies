const DeliveryScheduleController = require("../deliverySchedule.controller");

const mockStoreModel = {
  findById: jest.fn((_id) => ({ settings: {} })),
  exists: jest.fn(),
  updateOne: jest.fn(),
  findByIdAndUpdate: jest.fn((_id, _payload, _args) => ({
    settings: { config_delivery_schedule: {} },
  })),
  insertMany: jest.fn(),
  find: jest.fn(() => []),
};

jest.mock("mongoose", () => ({}));
jest.mock("myp-admin/database", () => ({
  Mongo: {
    Models: {
      StoreSchema: {
        Model: jest.fn(() => mockStoreModel),
      },
    },
  },
}));

describe("DeliveryScheduleController", () => {
  let controller;
  let req;
  let res;

  beforeEach(() => {
    controller = new DeliveryScheduleController();

    req = {
      store: "store_id",
      body: {
        averageDeliveryTime: 60,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("addAverageDeliveryTime", () => {
    it("should update the average delivery time and return the updated config_delivery_schedule", async () => {
      await controller.addAverageDeliveryTime(req, res);

      expect(mockStoreModel.findById).toHaveBeenCalledWith("store_id");
      expect(mockStoreModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "store_id",
        {
          settings: {
            config_delivery_schedule: {
              average_delivery_time: 60,
            },
          },
        },
        { new: true }
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ config_delivery_schedule: {} });
    });

    it("should return a 404 error if the store is not found", async () => {
      mockStoreModel.findById.mockResolvedValueOnce(null);

      await controller.addAverageDeliveryTime(req, res);

      expect(mockStoreModel.findById).toHaveBeenCalledWith("store_id");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "store_not_found" });
    });

    it("should return a 401 error if an internal server error occurs", async () => {
      mockStoreModel.findById.mockRejectedValueOnce(new Error());

      await controller.addAverageDeliveryTime(req, res);

      expect(mockStoreModel.findById).toHaveBeenCalledWith("store_id");
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "internal_server_error" });
    });
  });

  describe("getAverageDeliveryTime", () => {
    it("should return the config_delivery_schedule", async () => {
      const mockStore = {
        settings: {
          config_delivery_schedule: {
            average_delivery_time: 60,
          },
        },
      };

      mockStoreModel.findById.mockResolvedValueOnce(mockStore);

      await controller.getAverageDeliveryTime(req, res);

      expect(mockStoreModel.findById).toHaveBeenCalledWith("store_id");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        config_delivery_schedule: {
          average_delivery_time: 60,
        },
      });
    });

    it("should return a 404 error if the store is not found", async () => {
      mockStoreModel.findById.mockResolvedValueOnce(null);

      await controller.getAverageDeliveryTime(req, res);

      expect(mockStoreModel.findById).toHaveBeenCalledWith("store_id");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "store_not_found" });
    });

    it("should return a 401 error if an internal server error occurs", async () => {
      mockStoreModel.findById.mockRejectedValueOnce(new Error());

      await controller.getAverageDeliveryTime(req, res);

      expect(mockStoreModel.findById).toHaveBeenCalledWith("store_id");
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "internal_server_error" });
    });
  });
});
