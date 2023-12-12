
module.exports = [
  {
    request: '/v1/historyAboutUs',
    body: [
      { name: 'content', required: true, type: String },
    ],
  },
];
