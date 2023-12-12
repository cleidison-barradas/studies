module.exports = [
  {
    request: '/v1/store',
    body: [
      { name: 'external_id', type: Number },
      { name: 'url', type: String },
    ],
  },
];
