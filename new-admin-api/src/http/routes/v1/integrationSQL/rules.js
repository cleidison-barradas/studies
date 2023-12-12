module.exports = [
  {
    request: '/v1/integrationsql',
    body: [
      { name: 'name', required: true, type: String },
    ]
  }
]
