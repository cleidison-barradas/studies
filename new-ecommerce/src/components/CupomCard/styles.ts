import styled from 'styled-components'

export const CupomContainer = styled.div`
  width: 130px;
  height: 55px;
  background-color: ${({ theme }) => theme.color.secondary.medium};
  color: ${({ theme }) => theme.color.cta};

  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 0;
  border-radius: 8px;
  padding: 8px;
`

export const CupomLabel = styled.div`
  width: 70%;
  color: inherit;
  font-size: ${({ theme }) => theme.text.fontsize.xxs};
  font-family: ${({ theme }) => theme.text.fontFamily.primary};
`
