
module.exports = [
  {
    request: '/v1/statusOrder',
    body: [
      { name: 'name', required: true, type: String },
      { name: 'type', required: true, type: String },
    ],
  },
];
