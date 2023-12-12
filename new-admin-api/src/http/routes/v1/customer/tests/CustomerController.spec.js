const CustomerController = require("../controllers/CustomerController");

const mockStoreModel = {
  create: jest.fn(),
};

jest.mock("mongoose");
jest.mock("myp-admin/services/aws");
jest.mock("myp-admin/database/mongo", () => ({
  getModelByTenant: jest.fn(() => mockStoreModel),
}));

describe("CustomerController", () => {
  let customerController;
  let req;
  let res;

  const payload = {
    email: expect.any(String),
  };
  const newCustomer = {
    email: expect.any(String),
    lastname: "",
    firstname: "",
    password: "",
    phone: "",
    status: true,
    passwordSalt: 10,
    cpf: "",
  };

  beforeAll(() => {
    customerController = new CustomerController();
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

  describe("createWithEmail", () => {
    it("must create customer only with email", async () => {
      req.body = payload;
      const customer = {
        _id: expect.any(String),
        ...newCustomer,
      };

      mockStoreModel.create.mockResolvedValueOnce(customer);

      await customerController.createWithEmail(req, res);

      expect(mockStoreModel.create).toHaveBeenCalledWith(newCustomer);
      expect(res.json).toHaveBeenCalledWith({
        customer: customer,
      });
    });

    it("should return error when trying to create user", async () => {
      req.body = payload;
      mockStoreModel.create.mockRejectedValueOnce(new Error());

      await customerController.createWithEmail(req, res);

      expect(mockStoreModel.create).toHaveBeenCalledWith(newCustomer);
      expect(res.json).toHaveBeenCalledWith({
        error: "internal_server_error",
      });
    });
  });
});
