import styled from 'styled-components'

export const ImgProduct = styled.img`
  width: 44px;
  height: 44px;
  margin-right: 10px;
`

export const OrderCard = styled.div`
  border: 1px solid ${({ theme }) => theme.color.neutral.light};
  padding: 16px;
  border-radius: 20px;
`
