import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

export const PopperContainer = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: ${({ theme }) => theme.color.neutral.lightest};
  z-index: 5;
  box-shadow: 2px 6px 21px -2px rgb(0 0 0 / 75%);

  @media (min-width: 800px) {
    width: 360px;
    border-radius: 24px;
    padding-bottom: 32px;

    height: auto;
  }
`
