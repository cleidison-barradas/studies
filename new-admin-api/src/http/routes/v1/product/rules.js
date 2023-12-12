module.exports = [
  {
    request: '/v1/product',
    body: [
      { name: 'name', type: String },
      { name: 'classification', type: String },
      { name: 'active_principle', type: String },
    ],
  },
];
