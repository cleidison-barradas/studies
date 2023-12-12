module.exports = [
  {
    request: '/v1/publicAddress',
    body: [
      { name: 'street', required: true, type: String },
      { name: 'number', required: true, type: Number },
      { name: 'neighborhood', required: true },
    ],
  },
];
