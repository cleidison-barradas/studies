module.exports = [
  {
    request: '/v1/productClassification',
    body: [
      { name: 'name', required: true, type: String }
    ]
  }
]
