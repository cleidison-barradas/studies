function removeCategoryfromsubCategories(categories, categoryToRemove_ID) {
  categoryToRemove_ID = {$oid: categoryToRemove_ID}
  for (let category of categories){
    if(category.subCategories && category.subCategories.length > 0){
      for (var i = category.subCategories.length - 1; i >= 0; --i) {
        if(JSON.stringify(category.subCategories[i]._id) ===  JSON.stringify(categoryToRemove_ID) ){
          category.subCategories.splice(i,1);
        }
      }

    }
  }
  return categories
}

module.exports = {
  removeCategoryfromsubCategories
}
