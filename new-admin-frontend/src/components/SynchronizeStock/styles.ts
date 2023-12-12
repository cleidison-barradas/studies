import styled from 'styled-components'

export const SynchronizeStockStyled = styled.div`
  max-width: 600px;
  min-height: 600px;
  max-width: 600px;
  padding: 24px;
  width: 100%;
  margin: auto;

  background: #fff;
  border-radius: 24px;

  &,
  div {
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  justify-content: space-between;
  font-family: 'Poppins', sans-serif;

  h1 {
    font-size: 24px;
  }

  .sync {
    width: 100%;
    min-height: 600px;
    gap: 40px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .checkbox {
    flex-direction: row;
  }

  p,
  strong {
    font-size: 16px;
  }

  p,
  strong,
  h1 {
    color: #474f57;
    text-align: center;
  }

  button {
    text-transform: none;
  }
`
