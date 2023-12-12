require('dotenv').config()
const { ObjectID } = require('bson')
const { ORM, ProductRepository, StoreRepository } = require('@mypharma/api-core')


const Config = require('./config')
const xlsx = require("excel4node");
const nameFile = 'Products-quantity.xlsx'

exports.default = (async () => {
  ORM.config = Config.databases.mongoConfig
  await ORM.setup()
  const stores = await StoreRepository.repo().find({ select: ['originalId', 'tenant', 'name'] })
  const tenants = stores.map(store => store.tenant)
  const products = [];
  if (tenants.length > 0) {
    for await (const tenant of tenants) {
      await ORM.setup(null, tenant)

      const productsResults = await ProductRepository.repo(tenant).find(
        {
          where: {
            'EAN': { $ne: null },
            'quantity': { $gt: 4 },
            'status': true,
            $or: [
              {
                'category': { $exists: false }
              },
              {
                'manufacturer': { $exists: false }
              },
              {
                'classification': { $exists: false }
              },
              {
                'image': { $exists: false }
              },
            ]
          },
          select: ['EAN', 'quantity']
        });
      products.push(...productsResults);
    }
  }

  const prodfilter = []

  products.filter((prod, index, _products) => {
    const productsData = _products.filter(pr => pr.EAN === prod.EAN)
    if (productsData.length > 1) {
      prodfilter.push(...productsData)
    }
  })

  const ProductsOneArray = prodfilter.filter(function (elemProd, posicao, self) {
    return self.indexOf(elemProd) == posicao;

  })



  const sumProducts = new Map([]);
  const productsPush = Object.assign([], ProductsOneArray)

  for (const prod of productsPush) {
    let sumQuantity = 0;
    const exists = ProductsOneArray.filter(dupl => dupl.EAN === prod.EAN)
    if (exists.length > 1) {
      exists.forEach(item => sumQuantity += item.quantity)
      if (!sumProducts.has(prod.EAN)) {
        sumProducts.set(prod.EAN, { EAN: prod.EAN, quantity: sumQuantity })
      }
    }

  }
  let orderProducts = []

  sumProducts.forEach(item => orderProducts.push(item));
  orderProducts = orderProducts.sort((a, b) => b.quantity - a.quantity)
  orderProducts.length = 1000

  const Workbook = new xlsx.Workbook();
  const workSheet = Workbook.addWorksheet(nameFile);
  const headingColumnNames = [
    "EAN"
  ];

  let headingColumnIndex = 1;
  headingColumnNames.forEach(heading => {
    workSheet.cell(1, headingColumnIndex++).string(heading);
  });

  let rowIndex = 2;
  orderProducts.forEach(record => {
    let columnIndex = 1;
    Object.keys(record).forEach(columnName => {
      workSheet.cell(rowIndex, columnIndex++).string(record[columnName])
    });
    rowIndex++;
  });


  Workbook.write(nameFile);

})()
