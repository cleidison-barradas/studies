import { styled } from 'styled-components'

import { LinearProgressProps } from './model'

const colors = {
  loading: '#3E9DFF',
  fail: '#F03E3E',
  success: '#1E9C33',
  none: '#3E9DFF',
}

export const LinearProgressStyled = styled.div<LinearProgressProps>`
  width: 100%;
  height: 16px;

  background: #e0e8f0;
  overflow: hidden;
  border-radius: 8px;
  position: relative;

  > div {
    top: 0px;
    left: 0px;
    height: 100%;
    width: 100%;
    max-width: ${({ progress = 0 }) => progress}%;
    position: absolute;
    background: ${({ variant = 'loading' }) => colors[variant]};
    transition: all 0.3s;
  }
`
