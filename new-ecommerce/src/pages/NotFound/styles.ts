import styled from 'styled-components'

export const ReturnButton = styled.button`
  outline: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.color.primary.medium};
  position: relative;
  height: 40px;
  min-height: 40px;
  width: 40px;
  min-width: 40px;
  border-radius: 50%;
  padding: 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: white;

  :hover {
    color: white;
    background: ${({ theme }) => theme.color.primary.medium};
  }

  :active {
    opacity: 0.5;
  }
`