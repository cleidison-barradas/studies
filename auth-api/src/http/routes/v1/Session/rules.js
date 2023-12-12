module.exports = [
  {
    request: '/v1/sessions',
    body: [
      { name: 'userName', required : true,type: String },
      { name: 'password', required : true,type: String },
    ],
  },
];
