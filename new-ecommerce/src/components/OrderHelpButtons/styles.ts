import styled from 'styled-components'

export const WhatsappButton = styled.a`
  border-radius: 30px;
  color: white;
  background-color: ${({ theme }) => theme.color.feedback.approve.medium};
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  width: 100%;
  outline: none;
  border: none;
  text-decoration: none;
  padding: 8px;

  svg {
    height: 20px;
    width: 20px;
  }
`
