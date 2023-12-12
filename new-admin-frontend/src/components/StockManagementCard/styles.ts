import styled from 'styled-components'

import { StockManagementCardProps } from './model'

export const StockManagementCardStyled = styled.div<StockManagementCardProps>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  min-height: 280px;

  background: white;
  border-radius: 24px;
  padding: 24px;

  h1 {
    color: #474f57;
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 16px;
  }

  div,
  p {
    font-family: 'Montserrat', sans-serif;
    font-size: 16px;
    color: #474f57;
  }

  > div {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .active {
    width: fit-content;
    padding: 8px 16px;
    border-radius: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    color: ${({ active }) => (active ? '#006900' : '#474F57')};

    background: ${({ active }) => (active ? '#B7FFCC' : '#E0E8F0')};
  }

  p {
    color: #474f57;
    margin: 0px;
    font-size: 16px;
  }

  .group {
    display: flex;
    flex-wrap: wrap;
    max-width: 300px;
    gap: 16px;

    > div {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
  }
`
