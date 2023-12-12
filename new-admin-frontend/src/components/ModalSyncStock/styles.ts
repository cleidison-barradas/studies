import styled from 'styled-components'

export const ModalSyncStockStyled = styled.div`
  width: 90%;
  min-height: 600px;
  max-width: 600px;
  gap: 40px;

  &,
  > div {
    display: flex;
    flex-direction: column;

    justify-content: center;
    align-items: center;
  }

  > div {
    width: 80%;
  }

  border-radius: 20px;
  background: #ffffff;

  button {
    text-transform: none;
  }
`
