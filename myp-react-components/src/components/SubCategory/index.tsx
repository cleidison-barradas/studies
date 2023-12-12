import React, { useState } from 'react'

import {
  Backdrop,
  CategoryContainer,
  CategoryText,
  Container,
  FilterTag,
  ModalCaption,
  ModalContainer,
  ModalContent,
  ModalItem,
  ModalTagButton,
  ModalTitle,
  ReturnButton,
  SubCategoryContainer,
  TagContainer,
} from './styles'
import { ClickAwayListener, Hidden } from '@material-ui/core'

interface Filter {
  name: string
  title: string
  Icon: React.FC
}

export interface SubCategoryProps {
  title: string
  initialFilter?: string
  filters?: Filter[]
  onChangeFilter?: (filter: string) => any
  onReturn?: () => any
  ReturnIcon?: React.ReactNode
  DropDownIcon?: React.ReactNode
}

export const SubCategory: React.FC<SubCategoryProps> = ({
  title,
  children,
  filters = [],
  initialFilter,
  onChangeFilter = (value) => console.log(value),
  onReturn,
  ReturnIcon,
  DropDownIcon,
}) => {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<any>(initialFilter || null)

  const changeFilter = (name: string) => {
    setFilter(name)
    onChangeFilter(name)
  }

  return (
    <React.Fragment>
      <Container>
        <CategoryContainer>
          <ReturnButton onClick={onReturn}>{ReturnIcon}</ReturnButton>
          <CategoryText>{title}</CategoryText>
        </CategoryContainer>
        <SubCategoryContainer>{children}</SubCategoryContainer>
        <TagContainer>
          <Hidden mdDown>
            {filters.map(({ name, title }, index) => (
              <FilterTag
                selected={filter === name}
                key={index}
                onClick={() => changeFilter(name)}
              >
                {title}
              </FilterTag>
            ))}
          </Hidden>
          <Hidden mdUp>
            {filters.slice(0, 2).map(({ name, title }, index) => (
              <FilterTag
                selected={filter === name}
                key={index}
                onClick={() => changeFilter(name)}
              >
                {title}
              </FilterTag>
            ))}
            <FilterTag
              selected={!!filters.slice(2).find(({ name }) => name === filter)}
              onClick={() => setOpen(true)}
            >
              {!!filters.slice(2).find(({ name }) => name === filter)
                ? filters.slice(2).find(({ name }) => name === filter)?.title
                : 'Ordenar'}
              {DropDownIcon}
            </FilterTag>
          </Hidden>
        </TagContainer>
      </Container>
      {open && (
        <Backdrop open={open}>
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <ModalContainer>
              <ModalTitle>Ordenar por</ModalTitle>
              <ModalContent>
                {filters.slice(2).map(({ name, Icon, title }) => (
                  <ModalItem>
                    <ModalTagButton
                      onClick={() => changeFilter(name)}
                      selected={filter === name}
                    >
                      <Icon />
                    </ModalTagButton>
                    <ModalCaption> {title} </ModalCaption>
                  </ModalItem>
                ))}
              </ModalContent>
            </ModalContainer>
          </ClickAwayListener>
        </Backdrop>
      )}
    </React.Fragment>
  )
}
