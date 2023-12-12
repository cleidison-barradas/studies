const { expect, test } = require("@jest/globals");
const { isUndefined } = require("lodash");
const PaymentLinksService = require("../paymentLinks.service");
const {
  paymentLinksList,
  paymentLink,
} = require("./__mocks__/__data__/paymentLinks.data.js");
const { cart, productList } = require("./__mocks__/__data__/carts.data.js");

jest.mock("myp-admin/database", () => require("./__mocks__/database"));

jest.mock("myp-admin/database/mongo/models", () =>
  require("./__mocks__/database")
);

describe("Payment Links Service", () => {
  describe("getPaymentLinks", () => {
    // Arrange
    const paymentLinksService = new PaymentLinksService("tenant");

    test("should return error message", async () => {
      // Act
      const result = await paymentLinksService.getPaymentLinks();

      // Assert
      expect(result).toEqual({ message: "No payment link found" });
    });

    test("should return a single payment link", async () => {
      // Act
      const result = await paymentLinksService.getPaymentLinks(paymentLink._id);
      // Assert
      expect(result).toMatchObject({ cart, paymentLink });
    });

    test("should return a paginated list of payment links", async () => {
      // Act
      const page = 1,
        limit = 5;
      const result = await paymentLinksService.getPaymentLinks(null, {
        page,
        limit,
      });

      // Assert
      expect(result).toMatchObject({
        paymentLinks: paymentLinksList.slice((page - 1) * limit, page * limit),
        total: paymentLinksList.length,
        limit,
        pages: Math.ceil(paymentLinksList.length / limit),
        currentPage: page,
        prevPage: null,
        nextPage: 2,
      });
    });
  });

  describe("createPaymentLink", () => {
    // Arrange
    const paymentLinksService = new PaymentLinksService("tenant");

    test("should return a payment link", async () => {
      // Act
      const result = await paymentLinksService.createPaymentLink({
        products: productList,
        total: cart.total,
        storeUrl: "https://store.com/",
      });

      // Assert
      expect(isUndefined(result)).toBe(false);
    });
  });
});
