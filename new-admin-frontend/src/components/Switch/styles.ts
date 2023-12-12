import styled from 'styled-components'

import { SwitchProps } from './model'

export const SwitchStyled = styled.div<SwitchProps>`
  width: fit-content;
  height: fit-content;
  position: relative;
  cursor: pointer;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'all')};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};

  > div {
    width: 32px;
    height: 14px;
    background: ${({ checked, blocked }) => (blocked ? '#0B6AF2' : checked ? '#1E9C33' : '#7a828a')};
    border-radius: 50px;

    div {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 50%;
      border-radius: 50px;
      transition: all 0.15s;
      background: #ffffff;
      box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.2376);

      transform: translate(${({ checked, blocked }) => (blocked || checked ? '14' : '-2')}px, -50%);
    }
  }
`
