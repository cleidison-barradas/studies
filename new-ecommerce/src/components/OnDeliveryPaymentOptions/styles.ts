import styled from 'styled-components'

export const OptionButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px 15px 20px;
  border: 1px solid ${({ theme }) => theme.color.neutral.darkest};
  border-radius: 6px;
  outline: none;
  background: white;
`
