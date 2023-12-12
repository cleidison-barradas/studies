module.exports = [
  {
    request: '/v1/category',
    body: [
      
      { name: 'name', required: false, type: String },
      { name: 'description', type: String },
      { name: 'metaTitle', required: false, type: String },
      { name: 'metaDescription', required: false, type: String },
      
    ]
  },
  {
    request: '/v1/category',
    body: [
      
      { name: 'categories', type: Array },  
    ]
  }
]
