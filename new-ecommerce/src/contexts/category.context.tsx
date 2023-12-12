import React, { createContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useSWR from 'swr'
import Category from '../interfaces/category'
import Manufacturer from '../interfaces/manufacturer'
import { getCategory } from '../services/category/category.service'

interface CategoryContextData {
  searchQuery: string
  selectedFilter: string
  selectedCategory: Category | null
  fetchedCategory: boolean
  selectedSubCategory: Category | null
  fetchedSubCategory: boolean
  selectedManufacturers: Manufacturer[]
  isFetchingProducts: boolean
  setSelectedFilter: React.Dispatch<React.SetStateAction<string>>
  setSelectedCategory: React.Dispatch<React.SetStateAction<Category | null>>
  setSelectedSubCategory: React.Dispatch<React.SetStateAction<Category | null>>
  setSelectedManufacturers: React.Dispatch<React.SetStateAction<Manufacturer[]>>
  setFetchedSubCategory: React.Dispatch<React.SetStateAction<boolean>>
  setIsFetchingProducts: React.Dispatch<React.SetStateAction<boolean>>
}

const categoryContext = createContext({} as CategoryContextData)
const { Provider } = categoryContext

export const CategoryProvider: React.FC = ({ children }) => {
  const { categoryName = '', subCategoryName = '' } = useParams()
  const [selectedFilter, setSelectedFilter] = useState('asc')
  const [selectedManufacturers, setSelectedManufacturers] = useState<Manufacturer[]>([])

  const [searchQuery] = useState('')

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<Category | null>(null)
  const [fetchedCategory, setFetchedCategory] = useState(false)
  const [fetchedSubCategory, setFetchedSubCategory] = useState(false)
  const [isFetchingProducts, setIsFetchingProducts] = useState(false)

  const { data: categoryRequest } = useSWR('populated/categorys', getCategory)

  useEffect(() => {
    if (selectedFilter !== 'brand') setSelectedManufacturers([])
  }, [selectedFilter])

  useEffect(() => {
    if (categoryRequest?.categorys) {
      const category = categoryRequest.categorys.find((value) => value.slug === categoryName)
      if (category) {
        setSelectedCategory(category)
      }
      setFetchedCategory(true)
      if (category && subCategoryName) {
        const subCategory = category.subCategories.find((value) => value.slug === subCategoryName)
        if (subCategory) setSelectedSubCategory(subCategory)

        setFetchedSubCategory(true)
      }
    }
  }, [categoryRequest, categoryName, subCategoryName])

  return (
    <Provider
      value={{
        searchQuery,
        selectedFilter,
        selectedCategory,
        fetchedCategory,
        selectedSubCategory,
        fetchedSubCategory,
        selectedManufacturers,
        isFetchingProducts,
        setSelectedFilter,
        setSelectedCategory,
        setSelectedSubCategory,
        setSelectedManufacturers,
        setFetchedSubCategory,
        setIsFetchingProducts,
      }}
    >
      {children}
    </Provider>
  )
}

export default categoryContext
