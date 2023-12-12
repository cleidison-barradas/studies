module.exports = [
  {
    request: '/v1/users',
    body: [
      { name: 'userName', required: true, type: String },
      { name: 'password', required: true, type: String },
      { name: 'email', required: true, type: String }
    ],
  },
];
