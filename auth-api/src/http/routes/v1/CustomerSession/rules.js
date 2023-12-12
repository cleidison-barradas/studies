module.exports = [
  {
    request: '/v1/customer/session',
    body: [
      { name: 'email', required : true, type: String },
      { name: 'password', required : true, type: String },
    ],
  },
];
