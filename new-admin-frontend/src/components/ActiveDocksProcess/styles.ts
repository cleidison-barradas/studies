import { styled } from 'styled-components'

export const ActiveDocksProcessStyled = styled.div`
  &,
  div div {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  flex-direction: column;

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
  button,
  li {
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

    &.request_after_error,
    &.error {
      margin-top: 20px;
    }

    &.request_after_error {
      background: #7a828a;
    }

    &.success {
      background: #1e9c33;
    }
  }

  strong {
    font-weight: 700;
  }

  li {
    color: red;
  }
`
