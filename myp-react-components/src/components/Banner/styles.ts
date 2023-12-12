import styled from 'styled-components'

interface ContainerProps {
  src: string
}

export const Container = styled.button<ContainerProps>`
  height: 160px;
  width: 302px;

  background-image: ${({ src }) => `url(${src})`};
  background-size: 100% 100%;
  background-position: center;

  outline: none;
  border: none;

  color: #ffffff;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  box-sizing: border-box;
  padding: 50px;
  cursor: pointer;

  font-family: Poppins, sans-serif;

  border-radius: ${({ theme }) => theme.border.radius.lg};

  :disabled {
    cursor: default;
  }

  @media (min-width: 1280px) {
    height: 196px;
    width: 344px;
  }

  @media (min-width: 1440px) {
    height: 196px;
    width: 344px;
  }

  @media (min-width: 1920px) {
    height: 196px;
    width: 344px;
  }
`
