const {
  paymentLinksList,
  paymentLink,
} = require("../__data__/paymentLinks.data.js");
const { cartsList, cart } = require("../__data__/carts.data.js");

function getModelByTenant(tenant, modelName) {
  let mockedModule = null;

  if (modelName === "PaymentLinkSchema")
    mockedModule = {
      findById: jest.fn((id) => {
        return paymentLinksList.find((paymentLink) => paymentLink._id === id);
      }),
      paginate: jest.fn((filters, paginationOptions) => {
        const { page, limit } = paginationOptions;
        let paymentLinksListFiltered = paymentLinksList;

        if (filters.createdAt) {
          paymentLinksListFiltered = paymentLinksListFiltered.filter(
            (paymentLink) =>
              new Date(paymentLink.createdAt) >= filters.createdAt.$gte &&
              new Date(paymentLink.createdAt) <= filters.createdAt.$lt
          );
        }

        return {
          docs: paymentLinksListFiltered.slice(
            (page - 1) * limit,
            page * limit
          ),
          totalDocs: paymentLinksListFiltered.length,
          limit,
          totalPages: Math.ceil(paymentLinksListFiltered.length / limit),
          page,
          pagingCounter: 1,
          hasPrevPage: page > 1,
          hasNextPage: page < paymentLinksListFiltered.length,
          currentPage: page,
          prevPage: page > 1 ? page - 1 : null,
          nextPage: page < paymentLinksListFiltered.length ? page + 1 : null,
        };
      }),
      create: jest.fn((_paymentLink) => {
        return paymentLink;
      }),
    };
  else
    mockedModule = {
      findById: jest.fn((id) => {
        return cartsList.find((cart) => cart._id === id);
      }),
      create: jest.fn((_cart) => {
        return cart;
      }),
    };

  return mockedModule;
}

module.exports = {
  Mongo: {
    getModelByTenant,
  },
  CartSchema: {
    Model: getModelByTenant,
  },
};
