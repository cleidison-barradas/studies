import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const QuerySuggestionLink = styled(Link)`
  color: ${({ theme }) => theme.color.neutral.medium};
  text-decoration: none;

  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;

  &:hover {
    color: ${({ theme }) => theme.color.neutral.darkest};
  }
  z-index: 999999999999;
`
