const applyMetaVars = (
  metaTitle,
  metaDescription,
  { categoryName, parentName = null, storeName, storeCity }
) => {
  metaTitle = metaTitle
    .replace('%STORE_NAME%', storeName)
    .replace('%STORE_CITY%', storeCity)
    .replace('%CATEGORY_NAME%', categoryName)
  metaDescription = metaDescription
    .replace('%STORE_NAME%', storeName)
    .replace('%STORE_CITY%', storeCity)
    .replace('%CATEGORY_NAME%', categoryName)

  if (parentName) {
    metaTitle = metaTitle.replace('%PARENT_NAME%', parentName)
    metaDescription = metaDescription.replace('%PARENT_NAME%', parentName)
  }

  return { metaTitle, metaDescription }
}

export default applyMetaVars
