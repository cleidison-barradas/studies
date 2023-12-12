module.exports = [
  {
    request: '/v1/showcase',
    body: [
      { name: 'name',  type: String },
      { name: 'products', type : Array },
      { name: 'status' , type:Boolean}
    ],
  },
];
