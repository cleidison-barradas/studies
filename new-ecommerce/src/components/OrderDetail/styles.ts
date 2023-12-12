import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px;
  border-radius: 24px;
  background-color: #ffffff;
  border : 1px solid ${({ theme }) => theme.color.neutral.light};

  @media (max-width: 600px) {
    border-radius: 24px 24px 0 0;
  }

  @media (min-width: 600px) {
    max-width: 420px;
  }
`

export const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`

export const CloseBox = styled.button`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.color.neutral.darkest};
  font-size: ${({ theme }) => theme.text.fontsize.xxs};
  font-family: ${({ theme }) => theme.text.fontFamily.primary};
  outline: none;
  border: none;
  background: none;
`

export const ProductList = styled.div`
  width: 100%;
  max-height: 320px;
  overflow: auto;

  @media (min-width: 1079px) {
    max-height: 500px;
  }
`
