import styled from 'styled-components'

export const ModalContainer = styled.div`
  background: white;
  width: 100%;
  position: absolute;
  bottom: 0;
  border-radius: 30px 30px 0px 0px;
  padding: 24px;
  padding-bottom: 36px;
  margin: 0px;

  @media (min-width: 600px) {
    position: relative;
    border-radius: 30px 30px 30px 30px;
  }
`
export const ModalIconContainer = styled.div`
  color: ${({ theme }) => theme.color.primary.medium};
  width: 24px;
  height: 24px;
`
