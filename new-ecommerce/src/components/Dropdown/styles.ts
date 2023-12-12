import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 100%;

  .MuiTreeItem-content:hover {
    background-color: transparent;
  }

  .dropdown-container {
    border: 1px solid ${({ theme }) => theme.color.neutral.light};
    border-radius: 16px;
    padding-bottom: 12px;
    padding-right: 16px;
    margin-bottom: 16px;
    color: ${({ theme }) => theme.color.neutral.darkest};
    padding: 16px;
    font-size: 16px;
  }

  .MuiCollapse-root {
    margin-left: 0px;
    margin-top: 20px;
  }

  .selected {
    border-color: ${({ theme }) => theme.color.primary.medium};
    color: ${({ theme }) => theme.color.primary.medium};
  }

  .MuiTreeItem-iconContainer {
    width: 0px;
    margin-right: 0px;
  }

  .Mui-selected,
  .Mui-selected:hover {
    background: transparent;
  }

  .Mui-selected.Mui-focused {
    background: transparent;
  }

  .MuiTreeItem-label {
    font-size: inherit;
    font-family: Poppins, sans-serif;
    color: inherit;
  }
`
