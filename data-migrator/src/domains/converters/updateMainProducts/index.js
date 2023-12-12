const { logger, colors } = require('@mypharma/api-core')
const { updateEntities } = require('../../../converters/proccess')
const queryProducts = `
  SELECT
  p.product_id, p.ean, p.image, p.control_id, p.classification_id, p.manufacturer_id, p.active_principle, p.ms, CONCAT(p.model, ' ', pd.name) as name,
  pd.description, pd.meta_title, pd.meta_description, pd.meta_keyword, pu.url

  FROM oc_product as p
  inner join oc_product_description as pd on p.product_id=pd.product_id
  inner join oc_product_url as pu on p.product_id=pu.product_id`
const queryControl = `SELECT * FROM oc_control`
const queryCategory = `SELECT * from oc_category as c inner join oc_category_description as cd on c.category_id= cd.category_id`
const queryClassification = `SELECT * FROM oc_classification`
const queryManufacturer = `SELECT * FROM oc_manufacturer`

const queries = [
  {
    query: queryManufacturer,
    table: 'ManufacturerSchema'
  },
  {
    query: queryCategory,
    table: 'CategorySchema'
  },
  {
    query: queryControl,
    table: 'ProductControlSchema'
  },
  {
    query: queryClassification,
    table: 'ProductClassificationSchema'
  },
  {
    query: queryProducts,
    table: 'ProductSchema'
  }
]

const key = () => {
  return {
    name: 'importacão total dos produtos',
    operation: 'import_main_products'
  }
}

const handle = async () => {
  logger('ini process on master products!', colors.FgCyan)
  for await (const query of queries) {

    if (query.table === 'ProductSchema') {
      await updateEntities({ table: query.table })
    }
  }

  return true
}

module.exports = { key, handle }
