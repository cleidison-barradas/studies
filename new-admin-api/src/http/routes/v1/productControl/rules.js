module.exports = [
  {
    request: '/v1/productControl',
    body: [
      { name: 'description', required: true, type: String },
      { name: 'initials', required: true, type: String },
    ]
  }
]
