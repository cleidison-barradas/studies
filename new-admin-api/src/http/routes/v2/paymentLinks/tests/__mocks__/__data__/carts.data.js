let productList = [
  {
    product: {
      _id: "5f9f1b9b9b9b9b9b9b9b9b9b",
      name: "name",
      price: 0,
      quantity: 2,
      total: 0,
      createdAt: "2020-10-29T15:00:00.000Z",
      updatedAt: "2020-10-29T15:00:00.000Z",
    },
    amount: 2,
  },
  {
    product: {
      _id: "5f9f1b9b9b9b9b9b9b9b9b9b",
      name: "name",
      price: 0,
      quantity: 1,
      total: 0,
      createdAt: "2020-10-29T15:00:00.000Z",
      updatedAt: "2020-10-29T15:00:00.000Z",
    },
    amount: 1,
  },
];

const cart = {
  _id: "5f9f1b9b9b9b9b9b9b9b9b9b",
  tenant: "tenant",
  products: [
    {
      _id: "5f9f1b9b9b9b9b9b9b9b9b9b",
      name: "name",
      price: 0,
      quantity: 2,
      total: 0,
      createdAt: "2020-10-29T15:00:00.000Z",
      updatedAt: "2020-10-29T15:00:00.000Z",
    },
    {
      _id: "5f9f1b9b9b9b9b9b9b9b9b9b",
      name: "name",
      price: 0,
      quantity: 1,
      total: 0,
      createdAt: "2020-10-29T15:00:00.000Z",
      updatedAt: "2020-10-29T15:00:00.000Z",
    },
  ],
  fingerprint: "fingerprint",
  createdAt: "2020-10-29T15:00:00.000Z",
  updatedAt: "2020-10-29T15:00:00.000Z",
};

const cartsList = [
  {
    _id: "5f9f1b9b9b9b9b9b9b9b9b9b",
    tenant: "tenant",
    products: [
      {
        _id: "5f9f1b9b9b9b9b9b9b9b9b9b",
        name: "name",
        price: 0,
        quantity: 2,
        total: 0,
        createdAt: "2020-10-29T15:00:00.000Z",
        updatedAt: "2020-10-29T15:00:00.000Z",
      },
      {
        _id: "5f9f1b9b9b9b9b9b9b9b9b9b",
        name: "name",
        price: 0,
        quantity: 1,
        total: 0,
        createdAt: "2020-10-29T15:00:00.000Z",
        updatedAt: "2020-10-29T15:00:00.000Z",
      },
    ],
    fingerprint: "fingerprint",
    createdAt: "2020-10-29T15:00:00.000Z",
    updatedAt: "2020-10-29T15:00:00.000Z",
  },
];

module.exports = { cartsList, cart, productList };
