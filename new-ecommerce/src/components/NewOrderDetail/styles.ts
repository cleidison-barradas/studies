import styled from 'styled-components'

export const NewOrderDetailStyled = styled.div`
  border-radius: 24px;
  border: 1px solid #e0e8f0;
  overflow: hidden;
  font-family: 'Poppins', sans-serif;

  > header {
    display: flex;
    justify-content: space-between;
    padding: 20px 24px 16px;
    background: #e0e8f0;

    .title {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

      span {
        font-size: 18px;
        line-height: 21px;
        color: #474f57;
        font-weight: 500;
      }

      color: #7A828A;
      font-size: 18px;
    }
  }
`
