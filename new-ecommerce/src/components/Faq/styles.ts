import styled from 'styled-components'

export const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.color.neutral.darkest};
  text-align: center;
`
export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 16px;

  color: ${({ theme }) => theme.color.primary.medium};
`

export const Caption = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.color.neutral.darkest};
`

export const WhatsappButton = styled.a`
  border-radius: 30px;
  color: white;
  background-color: ${({ theme }) => theme.color.feedback.approve.medium};
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  width: 100%;
  max-width: 400px;
  outline: none;
  border: none;
  text-decoration: none;
  padding: 8px;

  svg {
    height: 26px;
  }
`
