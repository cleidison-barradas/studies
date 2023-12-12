import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  margin: 30px 0 30px 0;
`
export const OrderCardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;

  @media(max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media(max-width: 600px) {
    grid-template-columns: repeat(1, 1fr);
  }
`
