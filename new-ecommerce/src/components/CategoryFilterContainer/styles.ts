import styled from 'styled-components'

interface FilterTagProps {
  selected?: boolean
}

export const FilterTag = styled.button<FilterTagProps>`
  border: 1px solid
    ${({ theme, selected }) => (selected ? theme.color.primary.medium : theme.color.neutral.light)};
  border-radius: 500px;

  padding: 12px 12px;

  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  background: transparent;

  color: ${({ theme, selected }) =>
    selected ? theme.color.primary.medium : theme.color.neutral.dark};

  height: 40px;

  white-space: nowrap;

  :hover {
    color: ${({ theme, selected }) =>
      selected ? theme.color.primary.medium : theme.color.neutral.darkest};
    border-color: ${({ theme, selected }) =>
      selected ? theme.color.primary.medium : theme.color.neutral.darkest};
  }

  transition: all ease 200ms;
`

export const TagContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
`
