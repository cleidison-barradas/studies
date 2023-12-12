module.exports = [
  {
    request: '/v1/plan',
    body: [
      { name: 'name', required: true, type: String },
      { name: 'description', type: String },
      { name: 'price', required: true, type: Number },
    ],
  },
];
