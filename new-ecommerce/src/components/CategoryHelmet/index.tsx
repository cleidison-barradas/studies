import React, { useContext } from 'react'
import { Helmet } from 'react-helmet'
import categoryContext from '../../contexts/category.context'

export const CategoryHelmet = () => {
  const { selectedSubCategory, selectedCategory } = useContext(categoryContext)
  return (
    <Helmet>
      <title>
        {selectedSubCategory ? selectedSubCategory.metaTitle : selectedCategory?.metaTitle}
      </title>
      <meta
        name="title"
        content={selectedSubCategory ? selectedSubCategory.metaTitle : selectedCategory?.metaTitle}
      />

      <meta
        name="description"
        content={
          selectedSubCategory
            ? selectedSubCategory.metaDescription
            : selectedCategory?.metaDescription
        }
      />

      <meta
        property="og:title"
        content={selectedSubCategory ? selectedSubCategory.metaTitle : selectedCategory?.metaTitle}
      />

      <meta property="og:url" content={window.location.href} />
      <meta
        property="og:description"
        content={
          selectedSubCategory
            ? selectedSubCategory.metaDescription
            : selectedCategory?.metaDescription
        }
      />
    </Helmet>
  )
}
