/* tslint:disable */

import styled from 'styled-components'

export const SynchronizeStockLoadingStyled = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;

  button {
    width: 100%;
    max-width: 200px;
    
    &.success {
      background: #1e9c33;
      color: white;
    }
  }
`
