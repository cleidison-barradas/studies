import styled from 'styled-components'

export const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

export const Container = styled.div`
  margin-top: 80px;

  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 36px;
  flex: 1;

  @media (min-width: 599px) {
    margin-top: 110px;
  }

  @media (min-width: 900px) {
    margin-top: 136px;
  }

  @media (min-width: 1299px) {
    margin-left: 200px;
    margin-right: 200px;
  }

  @media (min-width: 1600px) {
    margin-left: 348px;
    margin-right: 348px;
  }
`
