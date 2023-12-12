import styled from 'styled-components'

interface CircleProps {
  color: string
}

export const Circle = styled.span<CircleProps>`
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
  width: 25px;
  height: 25px;

  :before {
    content: '';
    position: relative;
    display: block;
    width: 200%;
    height: 200%;
    box-sizing: border-box;
    margin-left: -50%;
    margin-top: -50%;
    border-radius: 45px;
    -webkit-animation: pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
    animation: pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
    background-color: ${({ color }) => color};
  }

  :after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 15px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
    -webkit-animation: pulse-dot 1.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite;
    animation: pulse-dot 1.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite;
    background-color: ${({ color }) => color};
  }

  @-webkit-keyframes pulse-ring {
    0% {
      -webkit-transform: scale(0.1);
      transform: scale(0.1);
    }
    80%,
    100% {
      opacity: 0;
    }
  }

  @keyframes pulse-ring {
    0% {
      -webkit-transform: scale(0.1);
      transform: scale(0.1);
    }
    80%,
    100% {
      opacity: 0;
    }
  }
  @-webkit-keyframes pulse-dot {
    0% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
    }
    50% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    100% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
    }
  }
  @keyframes pulse-dot {
    0% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
    }
    50% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    100% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
    }
  }-
`
