import styled from 'styled-components'
import { ModalToggleStockProps } from './model'

export const ModalToggleStockStyled = styled.div<Pick<ModalToggleStockProps, 'variant'>>`
  width: 90%;
  min-height: 210px;
  max-width: 700px;

  gap: 20px;
  padding: 24px;
  justify-content: space-between;
  font-family: 'Poppins', sans-serif;

  &,
  > div {
    display: flex;
    align-items: flex-start;
  }

  h4,
  p {
    margin: 0px;
  }

  h4 {
    font-weight: 500;
    font-size: 24px;

    color: ${({ variant }) => (variant === 'default' ? '#3E9DFF' : '#FB0234')};
  }

  p {
    font-family: 'Montserrat', sans-serif;
    font-size: 16px;
    color: #474f57;
  }

  > div {
    flex: 1;
    flex-direction: column;
    justify-content: center;

    width: 80%;
    gap: 20px;

    div {
      width: 100%;
      display: flex;
      justify-content: space-between;
      gap: 14px;

      button:last-child {
        color: white;
        background: #1e9c33;
      }
    }
  }

  border-radius: 20px;
  background: #ffffff;

  button {
    text-transform: none;
  }
`
