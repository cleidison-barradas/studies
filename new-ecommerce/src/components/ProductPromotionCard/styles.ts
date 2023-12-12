import styled from 'styled-components'

export const PromotionCard = styled.div`
  border: 1px solid ${({ theme }) => theme.color.neutral.light};
  border-radius: 24px;
  width: 100%;
  background: #fff;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column-reverse;
  gap: 32px;

  @media (min-width: 800px) {
    flex-direction: row;
  }
`
export const Timer = styled.p`
  color: ${({ theme }) => theme.color.neutral.darkest};
  box-shadow: 5px 5px 30px 5px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  width: 35px;
  height: 30px;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
`
