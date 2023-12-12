module.exports = [
  {
    request: '/v1/aboutUs',
    body: [
      { name: 'content', required : true, type: String },
    ],
  },
];
