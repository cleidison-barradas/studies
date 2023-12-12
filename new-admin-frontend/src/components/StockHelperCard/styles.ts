import styled from 'styled-components'

export const StockHelperCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 20px;
  font-family: 'Poppins', sans-serif;
  align-items: flex-start;
  min-height: 280px;
  background: #f4faff;
  padding: 10px 30px;
  gap: 16px;

  h3 {
    font-weight: 500;
    font-size: 20px;
    color: #474f57;
  }

  p {
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    color: #474f57;
  }

  button {
    background: transparent;
    outline: none;
    border: 0px;
    font-size: 16px;
    padding: 0px;
    font-family: 'Poppins', sans-serif;
    color: #3e9dff;
  }

  > img {
    width: 56px;
  }
`
