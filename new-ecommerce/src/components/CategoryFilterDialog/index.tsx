import React, { useContext } from 'react'
import categoryContext from '../../contexts/category.context'
import { Modal } from '../Modal'
import { CategoryFilter } from '../SubCategory'
import { ModalTitle, ModalContent, ModalItem, ModalTagButton, ModalCaption } from './styles'

interface CategoryFilterDialogProps {
  filters: CategoryFilter[]
  open: boolean
  onClickAway: () => any
}

export const CategoryFilterDialog: React.FC<CategoryFilterDialogProps> = ({
  filters,
  open,
  onClickAway,
}) => {
  const { selectedFilter } = useContext(categoryContext)

  return (
    <Modal open={open} onClickAway={onClickAway}>
      <ModalTitle>Ordenar por</ModalTitle>
      <ModalContent>
        {filters.slice(2).map(({ name, Icon, title, onClick }) => (
          <ModalItem key={title}>
            <ModalTagButton onClick={onClick} selected={selectedFilter === name}>
              {Icon}
            </ModalTagButton>
            <ModalCaption> {title} </ModalCaption>
          </ModalItem>
        ))}
      </ModalContent>
    </Modal>
  )
}
