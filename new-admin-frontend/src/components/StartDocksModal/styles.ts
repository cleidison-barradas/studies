import styled from 'styled-components'

export const StartDocksModalStyled = styled.div`
  max-width: 600px;
  min-height: 600px;
  max-width: 600px;
  padding: 24px;
  width: 100%;

  background: #fff;
  border-radius: 24px;

  &,
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  justify-content: space-between;

  > div {
    gap: 13px;
    justify-content: center;

    p {
      margin-bottom: 10px;
    }
  }

  h3,
  p,
  strong, button {
    font-family: 'Poppins', sans-serif;
  }

  h3 {
    font-size: 32px;
    font-weight: 500;
    text-align: center;
  }

  button {
    max-width: 185px;
    font-size: 16px;
    text-transform: none;
  }

  p,
  strong {
    font-size: 24px;
    text-align: center;
    color: #474F57;
  }

  strong {
    font-weight: 700;
  }

  img {
    width: 280px;
  }
`
