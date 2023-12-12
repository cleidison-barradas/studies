import styled from 'styled-components'

export interface LinkProps {
  color: 'primary' | 'secondary'
}

export const Link = styled.a<LinkProps>`
  color: ${({ theme, color }) => theme.color[color].medium};
  text-decoration: underline;
  font-weight: bold;
  margin: 8px 0 16px 0;
`
