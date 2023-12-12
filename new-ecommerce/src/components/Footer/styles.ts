import styled from 'styled-components'

export const Container = styled.footer`
  width: 100%;
  background-color: ${({ theme }) => theme.color.primary.medium};
  padding-top: 24px;
  padding-bottom: 70px;

  display: flex;
  flex-direction: column;

  @media (min-width: 800px) {
    padding-bottom: 0px;
  }

  .MuiDivider-root {
    border-color: ${({ theme }) => theme.color.primary.light};
  }
`

export const IconWrapper = styled.span`
  color: ${({ theme }) => theme.color.secondary.medium};
`

export const LegalInformations = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.color.primary.dark};
`
