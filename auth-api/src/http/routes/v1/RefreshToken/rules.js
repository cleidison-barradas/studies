module.exports = [
  {
    request: '/v1/refreshToken',
    body: [
      { name: 'token', required : true,type: String },
    ],
  },
];
