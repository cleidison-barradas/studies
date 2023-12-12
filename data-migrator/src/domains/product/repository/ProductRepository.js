const Mysql = require('../../../database')

class ProductRepository {

  /**
   *
   * @param {Array<String>} eans
   */
  async findByEans(eans) {
    const sql = `
    SELECT
      p.product_id,
      p.ean as EAN,
      p.model,
      pd.name,
      pd.description,
      pd.meta_title,
      pd.meta_description,
      p.active_principle,
      p.image,
      p.classification_id,
      cl.name as 'classification_name',
      p.control_id,
      co.description as 'control_name',
      co.initials as 'control_initials',
      p.manufacturer_id,
      ma.name as 'manufacturer_name',
      p.weight,
      p.length,
      p.width,
      p.height,
      p.status,
      p.verified
    FROM oc_product AS p
    INNER JOIN oc_product_description AS pd ON pd.product_id = p.product_id
    LEFT JOIN oc_manufacturer AS ma ON ma.manufacturer_id = p.manufacturer_id
    LEFT JOIN oc_classification AS cl ON cl.id = p.classification_id
    LEFT JOIN oc_control AS co ON co.id = p.control_id
    WHERE p.ean IN (${eans.toString()})
  `
    const query = await Mysql.query(sql)

    return query.length > 0 ? query[0] : []
  }

  /**
   *
   * @param {String} product_id
   * @returns {Promise<Array>}
   */
  async productCategories(product_id) {
    const sql = `
    SELECT category_id FROM oc_product_to_category WHERE product_id=${product_id}`

    const query = await Mysql.query(sql)

    return query.length > 0 ? query[0] : []
  }
}

module.exports = new ProductRepository('oc_product')

