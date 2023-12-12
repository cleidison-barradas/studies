import { Hidden } from '@mui/material'
import React, { useContext } from 'react'
import { TagContainer, FilterTag } from './styles'
import { CategoryFilter } from '../SubCategory'
import { DropdownIcon } from '../../assets/icons'
import categoryContext from '../../contexts/category.context'
import { KeyboardArrowDown } from '@mui/icons-material'

interface CategoryFilterProps {
  filters: CategoryFilter[]
  onOpen: () => void
}

export const CategoryFilterContainer: React.FC<CategoryFilterProps> = ({ filters, onOpen }) => {
  const { selectedFilter } = useContext(categoryContext)

  return (
    <TagContainer>
      <Hidden mdDown>
        {filters.map(({ name, title, isForm, onClick }, index) => (
          <FilterTag selected={selectedFilter === name} key={index} onClick={onClick}>
            {title}
            {isForm && <KeyboardArrowDown />}
          </FilterTag>
        ))}
      </Hidden>
      <Hidden mdUp>
        {filters.slice(0, 2).map(({ name, title, onClick }, index) => (
          <FilterTag selected={selectedFilter === name} key={index} onClick={onClick}>
            {title}
          </FilterTag>
        ))}
        <FilterTag
          selected={!!filters.slice(2).find(({ name }) => name === selectedFilter)}
          onClick={onOpen}
        >
          {!!filters.slice(2).find(({ name }) => name === selectedFilter)
            ? filters.slice(2).find(({ name }) => name === selectedFilter)?.title
            : 'Ordenar'}
          <DropdownIcon />
        </FilterTag>
      </Hidden>
    </TagContainer>
  )
}
