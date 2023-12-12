module.exports = [
  {
    request: '/v1/resetPassword',
    body: [
      { name: 'userId', required: true, type: String },
      { name: 'token', required: true, type: String },
      { name: 'password', required: true, type: String },
    ],
  },
];
