import styled from 'styled-components'

export const Container = styled.footer`
  width: 100%;
  background-color: ${({ theme }) => theme.color.neutral.lightest};
  padding-top: 24px;

  display: flex;
  flex-direction: column;

  .MuiDivider-root {
    border-color: ${({ theme }) => theme.color.primary.light};
  }
`

interface CaptionProps {
  margin?: boolean
  small?: boolean
}

export const Caption = styled.a<CaptionProps>`
  font-size: ${({ small = false }) => (small ? '14px' : '16px')};
  margin-bottom: ${({ margin = true }) => (margin ? '16px' : '0px')};
  color: ${({ theme }) => theme.color.neutral.darkest};
  text-decoration: none;
`

export const LegalInformations = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.color.neutral.light};
`

export const SmallText = styled.p`
  color: ${({ theme }) => theme.color.neutral.darkest};
  font-size: 9px;
`
