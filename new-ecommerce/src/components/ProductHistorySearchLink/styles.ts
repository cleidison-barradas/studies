import styled from 'styled-components'

export const ProductSuggestionLink = styled.a`
  color: ${({ theme }) => theme.color.neutral.medium};
  text-decoration: none;
  width: 100px;
  height: 115px;
  padding: 8px;

  border-radius: 4px;
  font-size: 12px;

  overflow: hidden;
  text-align: center;
  position: relative;

  &:hover {
    background: ${({ theme }) => theme.color.neutral.light};
    color: ${({ theme }) => theme.color.neutral.darkest};
  }

  display: flex;
  flex-direction: column;
  align-items: space-between;
  gap: 4px;

  img {
    max-width: 100px;
    border-radius: 4px;
  }
`
