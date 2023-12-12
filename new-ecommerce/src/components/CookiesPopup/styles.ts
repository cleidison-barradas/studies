import styled from 'styled-components'

export const CookieContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100vw;
  background: rgba(0, 0, 0, 0.9);
  z-index: 999999;
  padding: 16px;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`
export const AcceptButton = styled.button`
  outline: none;
  border: none;
  background-color: ${({ theme }) => theme.color.feedback.approve.dark};
  color: white;
  padding: 16px;
  font-size: 16px;
  border-radius: 8px;

  @media (max-width: 600px) {
    width: 100%;
    font-size: 18px;
    margin-top: 16px;
  }
`
