module.exports = [
  {
    request: '/v1/city',
    body: [
      { name: 'name', required: true, type: String },
      { name: 'state', required: true },
    ],
  },
];
