module.exports = [
  {
    request: '/v1/country',
    body: [{ name: 'name', required: true, type: String }],
  },
];
