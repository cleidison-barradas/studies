import styled from 'styled-components'

export const ShareLink = styled.button`
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 16px;
  color: ${({ theme }) => theme.color.neutral.darkest};
  font-size: 14px;
  background: none;
  outline: none;
  border: none;

  svg {
    width: 25px;
    height: 25px;
  }
`
