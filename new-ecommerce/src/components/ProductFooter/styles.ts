import styled from 'styled-components'

export const Container = styled.footer`
  height: 80px;
  width: 100vw;

  position: fixed;
  bottom: 0;
  left: 0;
  border-top: 0.5px solid ${({ theme }) => theme.color.neutral.light};
  padding: 16px;
  z-index: 3;
  background: #fff;

  display: flex;
  flex-direction: column;
  justify-content: center;

  gap: 16px;
`
export const WhatsappButton = styled.a`
  background-color: ${({ theme }) => theme.color.feedback.approve.medium};
  border-radius: 500px;
  height: 56px;
  width: 100%;
  text-decoration: none;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 18px;
  color: white;

  :hover {
    background-color: ${({ theme }) => theme.color.feedback.approve.dark};
  }
`
