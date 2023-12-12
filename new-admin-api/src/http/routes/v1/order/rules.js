module.exports = [
  {
    request: '/v1/order',
    body: [
      { name: 'statusOrder', required: true ,type: String }
    ]
  },
];
