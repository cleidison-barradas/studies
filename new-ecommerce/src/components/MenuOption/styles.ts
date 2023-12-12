import styled from 'styled-components'

export const MenuButton = styled.button`
  width: 100%;
  height: 72px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 0;
  background-color: #fff;
  border-bottom: 1px solid ${({ theme }) => theme.color.neutral.light};

`
