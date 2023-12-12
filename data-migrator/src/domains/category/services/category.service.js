const Mongo = require('../../../mongoDB')

function getCategoryByOriginalId(tenant = '', originalId) {
  const CategoryModel = Mongo.getModelByTenant(tenant, 'CategorySchema')

  return CategoryModel.findOne({
    originalId
  })
}

function getCategoryByOriginalIds(tenant = '', originalIds = []) {
  const CategoryModel = Mongo.getModelByTenant(tenant, 'CategorySchema')

  return CategoryModel.find({
    originalId: { $in: originalIds }
  })
}

function deleteCategories(tenant = '', originalIds = []) {
  const CategoryModel = Mongo.getModelByTenant(tenant, 'CategorySchema')

  return CategoryModel.deleteMany({
    originalId: { $nin: originalIds },
    parentId: '0'
  })
}

function bulkCategory(tenant, data = []) {
  const CategoryModel = Mongo.getModelByTenant(tenant, 'CategorySchema')

  return CategoryModel.bulkWrite(data)
}
function getMongoMainCategories(tenant) {
  const CategoryModel = Mongo.getModelByTenant(tenant, 'CategorySchema')

  return CategoryModel.find({
    parentId: '0'
  })
}


function getMongoCategoryByParentId(tenant, parentId) {
  const CategoryModel = Mongo.getModelByTenant(tenant, 'CategorySchema')

  return CategoryModel.find({ parentId })

}

module.exports = { getCategoryByOriginalId, deleteCategories, bulkCategory, getMongoMainCategories, getMongoCategoryByParentId, getCategoryByOriginalIds }
