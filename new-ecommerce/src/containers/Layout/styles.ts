import styled from 'styled-components'

interface ContainerProps {
  isHeaderHidden: boolean
  isFooterHidden: boolean
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;

  @media (min-width: 768px) {
    margin-left: 32px;
    margin-right: 32px;
    padding-top: ${({ isHeaderHidden }) => (!isHeaderHidden ? '190px' : '0px')};
  }

  @media (min-width: 900px) {
    padding-top: ${({ isHeaderHidden }) => (!isHeaderHidden ? '171px' : '0px')};
  }

  @media (min-width: 1079px) {
    margin-left: 108px;
    margin-right: 108px;
  }

  @media (min-width: 1200px) {
    padding-top: ${({ isHeaderHidden }) => (!isHeaderHidden ? '100px' : '0px')};
    padding-bottom: ${({ isFooterHidden }) => (!isFooterHidden ? '60px' : '0px')};
  }

  @media (max-width: 599px) {
    padding-top: ${({ isHeaderHidden }) => (!isHeaderHidden ? '222px' : '0px')};
    padding-bottom: ${({ isFooterHidden }) => (!isFooterHidden ? '100px' : '0px')};
  }
`
export const InnerContainer = styled.div`
  width: 100%;
  max-width: 1224px;
`
