import styled from 'styled-components'

export const LoginHeader = styled.header`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 24px;
  margin-bottom: 16px;
  position: absolute;
  top: 0;
  z-index: 3;
`

export const LoginContainer = styled.div`
  width: 100vw;
  height: 100vh;

  .primaryDark {
    fill: ${({ theme }) => theme.color.primary.dark};
  }

  .primaryLight {
    fill: ${({ theme }) => theme.color.primary.light};
  }

  .primaryLightest {
    fill: ${({ theme }) => theme.color.primary.lightest};
  }

  .primaryMedium {
    fill: ${({ theme }) => theme.color.primary.medium};
  }
`
export const Ilustration = styled.span`
  height: 200px;
  width: 250px;
  margin-top: 32px;

  @media (min-width: 834px) {
    height: 330px;
    width: 410px;
    margin-top: 0px;
  }
`

export const FormPaper = styled.div`
  padding: 16px;
  width: 100%;
  margin-top: 30px;

  @media (min-width: 600px) {
    background: white;
    border-radius: 24px;
    padding: 24px;
    max-width: 380px;
    box-shadow: 0px 24px 40px rgba(57, 57, 57, 0.08);
  }
`
export const BackgroundContainer = styled.div`
  width: 100%;
  height: auto;

  position: absolute;
  top: 0;
  z-index: 1;

  @media (min-width: 1080px) {
    height: 100vh;
    max-width: 1500px;
    overflow: hidden;
  }
`
export const FormContainer = styled.div`
  position: absolute;
  z-index: 2;
  width: 100%;
  max-width: 1700px;
  height: 100%;
  top: 0;
  padding-top: 100px;

  @media (min-width: 1079px) {
    padding-top: 0px;
    padding-right: 300px;
  }
`
