import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 24px;
`

export const CategoryContainer = styled.div`
  width: 100%;
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
`

export const ReturnButton = styled.button`
  border: none;
  outline: none;

  background: transparent;

  color: ${({ theme }) => theme.color.primary.medium};

  display: flex;
  justify-content: center;
  align-items: center;
  transition: all ease 200ms;
  border-radius: 50%;

  svg {
    margin-right: 2px;
  }

  @media (min-width: 768px) {
    width: 44px;
    height: 44px;

    :hover {
      color: white;
      background: ${({ theme }) => theme.color.primary.medium};
      filter: drop-shadow(0px 8px 24px rgba(0, 0, 0, 0.16));
    }
  }
`

export const CategoryText = styled.h1`
  color: ${({ theme }) => theme.color.neutral.darkest};

  font-size: 20px;
  font-weight: 500;
  font-family: ${({ theme }) => theme.text.fontFamily.primary};
  font-size: normal;

  @media (min-width: 768px) {
    font-size: 32px;
  }

  line-height: 120%;
`

export const SubCategoryContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  gap: 16px;

  padding-left: 16px;
  padding-bottom: 16px;

  @media (min-width: 768px) {
    gap: 32px;
  }
`

interface SubCategoryButtonProps {
  selected?: boolean
}

export const SubCategoryButton = styled.button<SubCategoryButtonProps>`
  background: ${({ theme, selected }) => (selected ? theme.color.neutral.light : 'transparent')};

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px;

  color: ${({ theme, selected }) =>
    selected ? theme.color.neutral.darkest : theme.color.neutral.dark};

  font-size: 14px;
  line-height: 144%;
  white-space: nowrap;
  padding-bottom: 8px;

  outline: none;

  border: none;
  border-bottom: 2px solid
    ${({ theme, selected }) => (selected ? 'none' : theme.color.neutral.dark)};

  font-family: ${({ theme }) => theme.text.fontFamily.primary};
  font-size: normal;

  transition: all linear 200ms;
  border-radius: ${({ selected }) => (selected ? '8px' : 'none')};

  :hover {
    color: ${({ theme }) => theme.color.neutral.darkest};
    border-bottom-color: ${({ theme }) => theme.color.neutral.darkest};
  }
`
