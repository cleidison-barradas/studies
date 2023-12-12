module.exports = [
  {
    request: '/v1/salesHistory',
    body: [
      { name: 'status'},
      { name: 'number', required: true, type: Number },
      { name: 'neighborhood', required: true },
    ],
  },
];
