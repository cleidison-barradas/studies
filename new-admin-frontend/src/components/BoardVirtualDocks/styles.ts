import styled from 'styled-components'

import { BoardVirtualDocksProps } from './model'

export const BoardVirtualDocksStyled = styled.div<BoardVirtualDocksProps>`
  font-family: 'Poppins', sans-serif;
  padding: 32px;

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;

    h1 {
      font-size: 28px;
      color: #3e9dff;
      margin: 0px;
      font-weight: 500;
    }

    button {
      text-transform: none;
      display: none;
      font-size: 16px;

      @media(max-width: 700px) {
        display: none;
      }
    }

    > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;

      gap: 8px;
    }

    p {
      margin: 0px;
      font-family: 'Montserrat', sans-serif;
      font-size: 18;
      color: ${({ mode }) => (mode === 'light' ? '#474f57' : '#F4F4F4')};
    }
  }

  .wrapper {
    display: grid;
    gap: 32px;
    margin-top: 30px;
    grid-template-columns: repeat(auto-fit, minmax(355px, 1fr));
  }
`
