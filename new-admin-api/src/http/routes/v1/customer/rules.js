module.exports = [
  {
    request: '/v1/costumer',
    body: [
      { name: 'full_name', required: true, type: String },
      { name: 'email', required: true, type: String },
      { name: 'password', required: true, type: String },
      { name: 'cpf', required: true, type: String }
    ],
  },
];
