import { styled } from 'styled-components'

export const ActiveDocksStyled = styled.div`
  padding: 32px;
  height: 630px;

  flex-direction: column;

  &,
  div div {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  > div div {
    flex-direction: row;

    gap: 30px;
  }

  div {
    width: 100%;
    height: 100%;
  }

  p,
  h1,
  strong,
  button {
    font-family: 'Poppins', sans-serif;
    text-align: center;
    color: #474f57;
  }

  h1 {
    font-size: 32px;
    font-weight: 500;
  }

  p {
    font-size: 16px;
  }

  button {
    color: #ffffff;
    text-transform: none;
  }

  strong {
    font-weight: 700;
  }
`
