import styled from 'styled-components'

export const HeaderContainer = styled.div`
  width: 100%;
  z-index: 2;
  top: 0;
  position: fixed;
`

export const SafeBuyTag = styled.div`
  width: 100%;
  height: 24px;

  background-color: ${({ theme }) => theme.color.feedback.approve.medium};
  color: ${({ theme }) => theme.color.neutral.lightest};

  font-size: 14px;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;

  @media (min-width: 768px) {
    height: 36px;
  }
`

export const TimerContainer = styled.div`
  width: 100%;
  height: 56px;
  background-color: ${({ theme }) => theme.color.neutral.light};
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 600px) {
    justify-content: space-between;
    gap: 0px;
    padding-right: 26px;
  }
`

export const InnerHeader = styled.div`
  width: 100%;
  height: 56px;
  background-color: ${({ theme }) => theme.color.neutral.light};
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 599px) {
    height: 80px;
  }
`
