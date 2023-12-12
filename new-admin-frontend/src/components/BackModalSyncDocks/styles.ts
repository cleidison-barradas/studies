import styled from 'styled-components'

export const BackModalSyncDocksStyled = styled.div`
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

  font-family: 'Poppins', sans-serif;

  h1 {
    font-size: 32px;
  }

  p,
  strong {
    font-size: 24px;
  }

  p,
  strong,
  h1 {
    color: #474f57;
    text-align: center;
  }

  footer {
    display: flex;
    align-items: center;

    gap: 15px;

    button {
      text-transform: none;

      &:first-child {
        background: #f03e3e;
      }

      &:last-child {
        background: #1e9c33;
      }
    }
  }
`
