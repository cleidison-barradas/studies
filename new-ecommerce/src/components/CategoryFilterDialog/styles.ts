import { alpha, hexToRgb } from '@mui/material'
import styled, { keyframes } from 'styled-components'

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
  background: ${({ theme }) => alpha(hexToRgb(theme.color.neutral.darkest), 0.9)};

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
  gap: 16px;
  margin-top: 47px;
`

interface ModalTagButtonProps {
  selected?: boolean
}

export const ModalTagButton = styled.button<ModalTagButtonProps>`
  background-color: #ffffff;
  border: 1px solid
    ${({ theme, selected }) =>
      selected ? theme.color.feedback.approve.medium : theme.color.neutral.medium};
  border-radius: 8px;

  color: ${({ theme, selected }) =>
    selected ? theme.color.feedback.approve.medium : theme.color.neutral.medium};

  height: 56px;
  width: 56px;
  margin-bottom: 16px;

  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    color: ${({ theme, selected }) =>
      selected ? theme.color.feedback.approve.medium : theme.color.neutral.darkest};

    border-color: ${({ theme, selected }) =>
      selected ? theme.color.feedback.approve.medium : theme.color.neutral.darkest};
  }

  transition: all linear 200ms;
`
export const ModalItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const ModalCaption = styled.h2`
  font-size: 14px;
  line-height: 144%;
  text-align: center;
  color: ${({ theme }) => theme.color.neutral.darkest};
  font-weight: normal;
  font-style: normal;
`
