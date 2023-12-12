import styled from 'styled-components'

export const BenefitsDocksStyled = styled.div`
  flex: 1;
  padding: 32px;

  &,
  div {
    width: 100%;
    height: 100%;
  }

  > div {
    height: 630px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  p,
  h1,
  strong {
    font-family: 'Poppins', sans-serif;
    text-align: center;
    color: #474f57;
  }

  h1 {
    font-size: 32px;
    font-weight: 500;
  }

  p {
    font-size: 18px;
  }

  strong {
    font-weight: 700;
  }

  button {
    text-transform: none;
  }

  .stock {
    width: 100%;
    max-width: 670px;
    margin: auto;

    footer {
      width: 100%;

      display: flex;
      align-items: center;
      gap: 24px;

      button {
        width: 100%;
      }
    }
  }
`
