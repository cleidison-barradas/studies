module.exports = [
    {
      request: '/v1/paymentOption',
      body: [
        { name: 'name', type: String, required: true },
        { name: 'type', type: String, required: true },
        { name: 'type', type: String },
      ],
    },
  ];
  