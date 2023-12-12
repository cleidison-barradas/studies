import styled from 'styled-components'

interface TagContainerProps {
  color: 'freeShipping' | 'promotional' | 'discount'
}

export const TagContainer = styled.p<TagContainerProps>`
  height: 24px;

  border-radius: ${({ theme }) => theme.border.radius.pill};

  color: ${({ theme }) => theme.color.neutral.lightest};
  background-color: ${({ theme, color }) => theme.color.suportColor[color]};

  display: flex;
  align-items: center;
  justify-content: center;

  font-family: ${({ theme }) => theme.text.fontFamily.primary};
  font-weight: ${({ theme }) => theme.text.fontWeight.medium};
  font-size: ${({ theme }) => theme.text.fontsize.xxs};
  line-height: ${({ theme }) => theme.text.lineHeight.medium};

  padding-left: ${({ theme }) => theme.spacing.inline.quarck};
  padding-right: ${({ theme }) => theme.spacing.inline.quarck};
`
