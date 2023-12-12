module.exports = [
  {
    request: '/v1/forgotPassword',
    body: [
      { name: 'email', required : true,type: String },
    ],
  },
];
