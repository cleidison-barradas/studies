module.exports = [
  {
    request: '/v1/store',
    body: [
      { name: 'name', required : true,type: String },
    ],
  },
];
