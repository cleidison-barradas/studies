const { v4 } = require("uuid");
const {
  Mongo: { getModelByTenant },
} = require("myp-admin/database");
const { paginationParser } = require("myp-admin/helpers");
const moment = require("moment");
const { CartSchema } = require("myp-admin/database/mongo/models");

class PaymentLinksService {
  constructor(_tenant, _storeId) {
    this.storeId = _storeId;
    this.tenant = _tenant;
  }

  async getPaymentLinks(id, query) {
    const PaymentLinks = getModelByTenant(this.tenant, "PaymentLinkSchema");
    const Carts = getModelByTenant(this.tenant, "CartSchema");

    if (id) {
      const paymentLink = await PaymentLinks.findById(id);
      const cart = await Carts.findById(paymentLink.cartId);
      return {
        paymentLink,
        cart,
      };
    }

    if (query) {
      const { page, limit, createdAt } = query;
      const paginationOptions = {
        page: page || 1,
        limit: limit || 5,
        sort: { createdAt: -1 },
      };
      const filters = {};

      if (createdAt) {
        filters["createdAt"] = {
          $gte: moment(createdAt).startOf("day").toDate(),
          $lt: moment(createdAt).endOf("day").toDate(),
        };
      }

      const pagination = await PaymentLinks.paginate(
        filters,
        paginationOptions
      );

      return paginationParser("paymentLinks", pagination);
    }

    return {
      message: "No payment link found",
    };
  }

  async createPaymentLink(paymentLinkForm) {
    const PaymentLinks = getModelByTenant(this.tenant, "PaymentLinkSchema");
    const paymentLinkFingerprint = v4();
    const Cart = await this.createCart(paymentLinkForm);

    const paymentLink = {
      fingerprint: paymentLinkFingerprint,
      link: `${paymentLinkForm.storeUrl}${
        paymentLinkForm.storeUrl[paymentLinkForm.storeUrl.length - 1] === "/"
          ? ""
          : "/"
      }checkout?l=${paymentLinkFingerprint}`,
      total: paymentLinkForm.total,
      deliveryFee: paymentLinkForm.deliveryFee,
      cartId: Cart._id,
    };

    return await PaymentLinks.create(paymentLink);
  }

  async createCart(cartForm) {
    const Carts = CartSchema.Model();
    const storeId = this.storeId;

    const products = cartForm.products.map((p) => ({
      product: p.product,
      quantity: p.amount,
    }));

    return await Carts.create({
      storeId,
      products,
      cupom: null,
      customerId: null,
      fingerprint: v4(),
    });
  }

  async deletePaymentlink(id) {
    const PaymentLinks = getModelByTenant(this.tenant, "PaymentLinkSchema");
    const paymentLink = await PaymentLinks.findByIdAndDelete(id).exec();

    return { deletedId: paymentLink._id };
  }
}

module.exports = PaymentLinksService;
