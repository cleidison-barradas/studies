import styled from 'styled-components'

export const TimerContainer = styled.div`
  width: 150px;
  display: flex;
  font-size: 10px;

  @media (min-width: 768px){
    width: 200px;
    font-size: 20px;
  }
`

export const TimerText = styled.p`
  color: ${({theme}) => theme.color.neutral.dark};
  font-size: 10px;
`

export const Timer = styled.p`
  color: ${({ theme }) => theme.color.neutral.darkest};
  background-color: ${({theme}) => theme.color.neutral.lightest};
  box-shadow: 5px 5px 30px 5px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  width: 20px;
  height: 17px;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  @media (min-width: 768px) {
    width: 35px;
    height: 30px;
    font-size: 16px;
  }
`
