module.exports = [
  {
    request: '/v1/openingHour',
    body: [
      { name: 'weekDay', type: String },
      { name: 'openingTime', type: String },
      { name: 'closingTime', type: String },
      { name: 'store', type: String },
    ],
  },
];
