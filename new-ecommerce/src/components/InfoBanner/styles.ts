import styled from 'styled-components'

export const InfoCard = styled.div`
  width: 312px;
  height: 168px;
  min-width : 312px;
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.color.neutral.light};
  padding: 24px;

  @media (min-width: 600px) {
    width: 328px;
    min-width: 328px;
  }

  @media (min-width: 800px) {
    width: 392px;
    min-width: 392px;
    padding-right: 104px;
  }
`
export const IconContainer = styled.div`
  height: 40px;
  width: 40px;
  min-width: 40px;
  color: ${({ theme }) => theme.color.primary.medium};
`
export const Title = styled.h3`
  font-weight: bold;
  font-size: 24px;
  line-height: 120%;

  color: ${({ theme }) => theme.color.neutral.darkest};
`

export const Description = styled.p`
  font-weight: normal;
  font-size: 14px;
  line-height: 144%;

  color: ${({ theme }) => theme.color.neutral.darkest};
`
