import styled from 'styled-components'

interface CardProps {
  selected: boolean
}

export const Card = styled.button<CardProps>`
  width: 100%;
  height : 96px;
  border: 1px solid
    ${({ theme, selected }) => (selected ? theme.color.primary.medium : theme.color.neutral.light)};
  background: white;
  outline: none;
  padding: 8px;
  display: flex;
  flex-direction: column;
  border-radius: 16px;

  .icon {
    color: ${({ theme, selected }) =>
      selected ? theme.color.primary.medium : theme.color.neutral.medium};
  }

  :hover{
    box-shadow: ${({ theme, selected }) =>
      selected ? "none" : "0px 1px 16px 0px rgba(0, 0, 0, 0.1)"};
  }
`
