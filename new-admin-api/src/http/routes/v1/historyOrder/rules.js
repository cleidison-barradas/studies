
module.exports = [
  {
    request: '/v1/historyOrder',
    body: [
      { name: 'order', required: true },
      { name: 'costumer', required: true },
    ],
  },
];
