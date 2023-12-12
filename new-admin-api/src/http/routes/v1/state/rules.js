module.exports = [
  {
    request: '/v1/state',
    body: [
      { name: 'name', required: true, type: String },
      { name: 'country', required: true },
    ],
  },
];
