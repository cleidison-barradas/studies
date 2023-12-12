module.exports = [
  {
    request: '/v1/neighborhood',
    body: [
      { name: 'name', required: true, type: String },
      { name: 'city', required: true },
    ],
  },
];
