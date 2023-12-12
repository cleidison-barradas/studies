import { styled } from 'styled-components'

export const StockNotificationStyled = styled.div`
  width: 100%;
  background: white;
  border: 1px solid #e72222;
  border-radius: 16px;
  padding: 18px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0px;
    color: #e72222;
    font-family: 'Poppins', sans-serif;
    font-size: 24px;
    font-weight: 500;
  }

  p {
    font-size: 16px;
    color: #000;
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
  }

  button {
    max-width: 200px;
    font-family: 'Poppins', sans-serif;
    text-transform: none;
    font-size: 16px;
  }

  div {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    gap: 20px;

    div {
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: 4px;
    }
  }
`
