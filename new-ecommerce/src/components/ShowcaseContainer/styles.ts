import styled from 'styled-components'

export const Title = styled.h1`
  font-size: 18px;
  font-weight: 500;
  font-family: Poppins;

  margin-bottom: 16px;

  color: ${({ theme }) => theme.color.neutral.darkest};
`
export const Subtitle = styled.h2`
  font-size: 18px;
  font-weight: normal;
  font-family: Poppins;

  color: ${({ theme }) => theme.color.neutral.darkest};
`
