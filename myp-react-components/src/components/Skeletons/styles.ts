import styled from 'styled-components'

export const Banner = styled.div`
  height: 160px;
  max-height: 160px;
  width: 302px;
  max-width: 302px;

  @media (min-width: 1280px) {
    height: 196px;
    max-height: 196px;
    width: 344px;
    max-width: 344px;
  }

  @media (min-width: 1440px) {
    height: 196px;
    max-height: 196px;
    width: 392px;
    max-width: 392px;
  }

  @media (min-width: 1920px) {
    height: 196px;
    max-height: 196px;
    width: 552px;
    max-width: 552px;
  }
`

export const ProductContainer = styled.div`
  width: 140px;
  max-width: 140px;
  height: 400px;
  max-height: 400px;
  display: flex;
  flex-direction: column;

  @media (min-width : 800px){
    width : 184px;
    max-width: 184px;
  }
`

export const Tag = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 8px 0;
`

export const ProductInfo = styled.div`
  width: 93px;
  max-width: 93px;
  height: 16px;
  max-height: 16px;
  margin: 7px 0;

  @media (min-width: 800px) {
      width: 122px;
      max-width: 122px;
  }
`

export const HeaderContainer = styled.header`
  width: 100%;
  height: 150px;
  max-height: 150px;

  @media (min-width: 768px) {
    height: 171px;
    max-height: 171px;
  }

  @media (min-width: 1200px) {
    height: 104px;
    max-height: 104px;
  }
`

export const CategoryContainer = styled.div`
  height: 128px;
  width: 96px;
  min-width: 96px;

  background-color: #FFF;
  border-radius: 24px;
  border: none;

  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 8px;
  padding-top: 40px;

  @media (min-width: 768px) {
    box-shadow: 0px 24px 40px rgba(57, 57, 57, 0.08);
    height: 132px;
    width: 152px;
    padding-top: 60px;
  }
`
