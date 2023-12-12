import styled, { keyframes } from 'styled-components'

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
`

export const ReturnButton = styled.button`
  border: none;
  outline: none;

  background: transparent;

  color: ${({theme})=> theme.color.primary.medium};

  position: absolute;
  left: 0;

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

export const CategoryText = styled.h3`
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
  background: transparent;

  color: ${({ theme, selected }) =>
    selected ? theme.color.primary.medium : theme.color.neutral.dark};

  font-size: 14px;
  line-height: 144%;
  white-space: nowrap;
  padding-bottom: 8px;

  outline: none;

  border: none;
  border-bottom: 2px solid
    ${({ theme, selected }) =>
      selected ? theme.color.primary.medium : theme.color.neutral.dark};

  font-family: ${({ theme }) => theme.text.fontFamily.primary};
  font-size: normal;

  transition: all linear 200ms;

  :hover {
    color: ${({ theme, selected }) =>
      selected ? theme.color.primary.medium : theme.color.neutral.darkest};
    border-bottom-color: ${({ theme, selected }) =>
      selected ? theme.color.primary.medium : theme.color.neutral.darkest};
  }
`

interface FilterTag {
  selected?: boolean
}

export const FilterTag = styled.button<FilterTag>`
  border: 1px solid
    ${({ theme, selected }) =>
      selected ? theme.color.primary.medium : theme.color.neutral.light};
  border-radius: 500px;

  padding: 12px 12px;

  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: transparent;

  color: ${({ theme, selected }) =>
    selected ? theme.color.primary.medium : theme.color.neutral.dark};

  height: 40px;

  white-space: nowrap;

  :hover {
    color: ${({ theme, selected }) =>
      selected ? theme.color.primary.medium : theme.color.neutral.darkest};
    border-color: ${({ theme, selected }) =>
      selected ? theme.color.primary.medium : theme.color.neutral.darkest};
  }

  transition: all ease 200ms;
`

export const TagContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
`

interface BackdropProps {
  open: boolean
}

const growUp = keyframes`
  from {
    height: 0px;
  }
  to {
    height: 300px;
  }
`

export const Backdrop = styled.div<BackdropProps>`
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;

  z-index: 2;
  background: ${({ theme }) => theme.color.neutral.darkest};
  opacity: 0.9;

  visibility: ${({ open }) => (open ? 'visible' : 'hidden')};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  transition: all ease 1s;
`

export const ModalContainer = styled.div`
  width: 100vw;
  height: 300px;

  background: #ffffff;

  padding: 40px;
  padding-top: 24px;

  z-index: 3;

  border-radius: 30px 30px 0px 0px;

  animation-name: ${growUp};
  animation-duration: 500ms;
`
export const ModalTitle = styled.h1`
  text-align: center;
  font-size: 20px;

  font-family: ${({ theme }) => theme.text.fontFamily.primary};
  line-height: 120%;

  color: #000000;
`
export const ModalContent = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: space-between;
  margin-top: 47px;
`

interface ModalTagButton {
  selected?: boolean
}

export const ModalTagButton = styled.button<ModalTagButton>`
  background-color: #ffffff;
  border: 1px solid
    ${({ theme, selected }) =>
      selected
        ? theme.color.feedback.approve.medium
        : theme.color.neutral.medium};
  border-radius: 8px;

  color: ${({ theme, selected }) =>
    selected
      ? theme.color.feedback.approve.medium
      : theme.color.neutral.medium};

  height: 56px;
  width: 56px;
  margin-bottom: 16px;

  :hover {
    color: ${({ theme, selected }) =>
      selected
        ? theme.color.feedback.approve.medium
        : theme.color.neutral.darkest};

    border-color: ${({ theme, selected }) =>
      selected
        ? theme.color.feedback.approve.medium
        : theme.color.neutral.darkest};
  }

  transition: all linear 200ms;
`
export const ModalItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
`

export const ModalCaption = styled.h2`
  font-size: 14px;
  line-height: 144%;
  text-align: center;
  color: ${({ theme }) => theme.color.neutral.darkest};
  font-weight: normal;
  font-style: normal;
`
