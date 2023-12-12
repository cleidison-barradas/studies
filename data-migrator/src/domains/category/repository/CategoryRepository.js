const Mysql = require('../../../database')

class CategoryRepository {

  /**
 * all categories from MYSQL
 * @returns {Promise<Array>} categories
 */
  async findAll() {
    const sql = `
    SELECT
    cd.name,
    c.category_id as originalId,
    c.parent_id as parentId,
    cd.meta_description as metaDescription,
    cd.meta_title as metaTitle

    FROM oc_category as c

    INNER JOIN
    oc_category_description as cd on c.category_id=cd.category_id`

    const query = await Mysql.query(sql)

    return query.length > 0 ? query[0] : []
  }

  /**
   * get categories by id from MYSQL
   * @param {Array<String>} ids
   * @returns {Promise<Array>} categories
   */
  async findByIds(ids) {
    const sql = `
    SELECT
    cd.name,
    c.category_id as originalId,
    c.parent_id as parentId,
    cd.meta_description as metaDescription,
    cd.meta_title as metaTitle

    FROM oc_category as c

    INNER JOIN
    oc_category_description as cd on c.category_id=cd.category_id

    WHERE c.category_id IN (${ids.toString()})
    `
    const query = await Mysql.query(sql)

    return query.length > 0 ? query[0] : []
  }

  /**
   * get subCategories MYSQL
   *
   * @param {String} parent_id
   * @returns {Promise<Array>} subcategories
   */
  async getSubCategories(parent_id) {
    const sql = `
    SELECT
    cd.name,
    c.category_id as originalId,
    cd.meta_title as metaTitle,
    cd.meta_description as metaDescription

    FROM oc_category as c
    INNER JOIN oc_category_description as cd
    ON c.category_id=cd.category_id
    WHERE parent_id=${parent_id};
    `
    const query = await Mysql.query(sql)

    return query.length > 0 ? query : []
  }
}

module.exports = new CategoryRepository('oc_category')
