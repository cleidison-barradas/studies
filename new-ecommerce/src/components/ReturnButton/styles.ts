import styled from 'styled-components'

export const Button = styled.button`
  outline: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.color.primary.medium};

  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 40px;
  height: 40px;

  transition: all 300ms;

  background: transparent;

  :hover {
    background: ${({ theme }) => theme.color.primary.medium};
    color: white;
  }

  :active {
    opacity: 0.5;
  }

  @media (max-width: 600px) {
    height: auto;
    width: auto;
    padding : 8px;
  }
`
