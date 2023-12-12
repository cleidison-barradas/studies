import styled from 'styled-components'

interface HeaderContainerProps {
  color: 'primary' | 'secondary'
}

export const HeaderContainer = styled.header<HeaderContainerProps>`
  width: 100%;
  background-color: ${({ theme, color }) => theme.color[color].medium};
  box-sizing: border-box;
  padding: 16px;
  padding-top: 24px;
  padding-bottom: 24px;
  max-height: 160px;
  color: ${({ theme }) => theme.color.neutral.lightest};
  z-index: 2;
  top: 0;
  position: fixed;

  @media (min-width: 768px) {
    max-height: 171px;
  }

  @media (min-width: 1200px) {
    max-height: 104px;
  }

  @media (max-width: 768px) {
    position: fixed;
  }
`
