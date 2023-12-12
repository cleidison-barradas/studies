
module.exports = [
  {
    request: '/v1/user',
    body: [
      { name: 'originalId', required: true, type: Number},
      { name: 'email', required: true, type: String },
      { name: 'avatar', type: String },
      { name: 'plan', required: true, type: String },
      { name: 'role', required: true, type: String },
      { name: 'status', required: true, type: String },
      { name: 'name', required: true, type: String },
    ],
  },
];
