import styled from 'styled-components'

export const ModalContainer = styled.div`
  width: 100vw;
  height: auto;

  background: #ffffff;

  padding: 8px;

  z-index: 3;

  position: absolute;
  bottom: 0;
  left: 0;

  border-radius: 30px 30px 0px 0px;

  @media (min-width: 800px) {
    border-radius: 30px;
    padding: 16px;
  }
`
export const ModalTitle = styled.h1`
  text-align: center;
  font-size: 20px;

  font-family: ${({ theme }) => theme.text.fontFamily.primary};
  line-height: 120%;

  color: #000000;
`
