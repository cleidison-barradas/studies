import styled from 'styled-components'

export const DrawerContainer = styled.div`
  width: 100vw;
  max-width: 600px;
  height: 100vh;
  position: relative;
`

export const DrawerHeader = styled.div`
  height: 82px;
  width: 100%;

  background-color: ${({ theme }) => theme.color.primary.medium};
  color: #ffffff;

  display: flex;
  align-items: center;
  gap: 27px;

  padding-left: 32px;
  font-size: 20px;

  @media (min-width: 600px) {
    height: 101px;
  }
`

export const DrawerFooter = styled.footer`
  position: absolute;
  bottom: 0px;
  width: 100%;
  max-height: 168px;
  padding: 16px;
  border-top: 1px solid rgba(120, 120, 120, 0.1);
  background-color: #ffffff;
  .grey-btn {
    color: #787878;
    border-color: #787878;
  }
`

export const CloseButton = styled.button`
  outline: none;
  border: none;
  background: transparent;
  color: inherit;

  display: flex;
  justify-content: center;
  align-items: center;
`
export const DrawerBody = styled.div`
  padding: 16px;
  max-height: 75vh;
  overflow: auto;
`

export const SectionContainer = styled.div`
  padding-bottom: 17px;
  margin-top: 17px;
  border-bottom: 1px solid #787878;

  .buttongroup-wrapper .MuiButtonGroup-grouped:not(:first-of-type) {
    border-radius: 0px 20px 20px 0px;
  }
  .buttongroup-wrapper .MuiButtonGroup-grouped:not(:last-of-type) {
    border-radius: 20px 0px 0px 20px;
  }
`

interface AlternateButtonProps {
  selected?: boolean
}

export const AlternateButton = styled.button<AlternateButtonProps>`
  border: 1px solid ${({ selected, theme }) => (selected ? theme.color.primary.medium : '#000000')};
  color: ${({ selected, theme }) => (selected ? theme.color.primary.medium : '#000000')};
  text-transform: uppercase;
  font-size: 14px;
  background: transparent;
  width: 162px;
  height: 40px;
`
