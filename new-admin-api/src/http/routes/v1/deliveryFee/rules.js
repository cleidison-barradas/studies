module.exports = [
  {
    request: '/v1/deliveryfee',
    body: [
      { name: 'feePrice', required: true },
      { name: 'neighborhood', required: true },
      { name: 'neighborhood', required: true },
      { name: 'deliveryTime', required: true, type: Number },
    ],
  },
];
