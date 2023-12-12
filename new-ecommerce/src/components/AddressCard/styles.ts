import styled from 'styled-components'

interface CardProps {
  selected?: boolean | null
}

export const CardInfo = styled.div`
  word-break: break-word;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`

export const CardContainer = styled.div<CardProps>`
  width: 100%;
  max-width: 750px;
  min-height: 72px;
  box-sizing: border-box;
  border: 1px solid
    ${({ selected, theme }) => (selected ? theme.color.primary.medium : theme.color.neutral.light)};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  padding: 16px;
`
