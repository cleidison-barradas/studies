module.exports = [
  {
    request: '/v1/banner',
    body: [
      { name: 'description', required : true,type: String },
    ],
  },
];
