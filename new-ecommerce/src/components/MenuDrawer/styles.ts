import styled from 'styled-components'

interface MobileModalProps {
  open: boolean
}

export const MobileModal = styled.div<MobileModalProps>`
  width: 100vw;

  z-index: 3;
  background-color: white;

  display: ${({ open }) => (open ? 'block' : 'none')};
  overflow-y: auto;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 72px;
`
export const MenuHeader = styled.div`
  width: 100%;
  height: 80px;
  background: ${({ theme }) => theme.color.primary.medium};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`

export const CloseButton = styled.button`
  background: transparent;
  color: white;
  position: absolute;
  left: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  outline: none;
  border: none;
`
